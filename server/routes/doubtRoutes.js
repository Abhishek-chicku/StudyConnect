const express = require("express");
const mongoose = require("mongoose");

const Doubt = require("../models/Doubt");
const Session = require("../models/Session");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function getTokenCost(priority) {
  if (priority === "High") return 20;
  if (priority === "Urgent") return 20;
  if (priority === "Medium") return 10;

  return 5;
}

function getPriorityValue(priority) {
  if (priority === "High" || priority === "Urgent") {
    return 3;
  }

  if (priority === "Medium") {
    return 2;
  }

  return 1;
}

function normalizePriority(priority) {
  if (priority === "Normal") {
    return "Low";
  }

  if (priority === "Urgent") {
    return "High";
  }

  if (priority === "Medium") {
    return "Medium";
  }

  if (priority === "High") {
    return "High";
  }

  return "Low";
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can create doubts",
      });
    }

    const { subject, question, description, priority } = req.body;

    if (!subject || !question) {
      return res.status(400).json({
        message: "Subject and question are required",
      });
    }

    if (question.trim().length < 5) {
      return res.status(400).json({
        message: "Question must contain at least 5 characters",
      });
    }

    const selectedPriority = normalizePriority(priority);

    const tokenCost = getTokenCost(selectedPriority);

    const student = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        role: "student",
        availableTokens: {
          $gte: tokenCost,
        },
      },
      {
        $inc: {
          availableTokens: -tokenCost,
          reservedTokens: tokenCost,
        },
      },
      {
        new: true,
      },
    );

    if (!student) {
      return res.status(400).json({
        message: "Not enough tokens",
      });
    }

    try {
      const doubt = await Doubt.create({
        studentId: student._id,
        studentName: student.name,
        subject: subject.trim(),
        question: question.trim(),
        description: description?.trim() || "",
        priority: selectedPriority,
        tokenCost,
        status: "Pending",
      });

      res.status(201).json({
        message: "Doubt created successfully",
        doubt,
        wallet: {
          availableTokens: student.availableTokens,
          reservedTokens: student.reservedTokens,
        },
      });
    } catch (error) {
      await User.findByIdAndUpdate(student._id, {
        $inc: {
          availableTokens: tokenCost,
          reservedTokens: -tokenCost,
        },
      });

      throw error;
    }
  } catch (error) {
    console.log("Create doubt error:", error.message);

    res.status(500).json({
      message: "Failed to create doubt",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    /* STUDENT */

    if (req.user.role === "student") {
      const doubts = await Doubt.find({
        studentId: req.user.id,
      })
        .populate("tutorId", "name email")
        .sort({
          createdAt: -1,
        });

      return res.json(doubts);
    }

    if (req.user.role === "tutor") {
      const doubts = await Doubt.find({
        $or: [
          {
            status: "Pending",
          },
          {
            tutorId: req.user.id,
          },
        ],
      })
        .populate("studentId", "name email")
        .sort({
          createdAt: -1,
        });

      doubts.sort((a, b) => {
        return getPriorityValue(b.priority) - getPriorityValue(a.priority);
      });

      return res.json(doubts);
    }

    return res.status(403).json({
      message: "Invalid user role",
    });
  } catch (error) {
    console.log("Get doubts error:", error.message);

    res.status(500).json({
      message: "Failed to get doubts",
    });
  }
});

router.get("/student/:studentId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can access this route",
      });
    }

    if (req.user.id !== req.params.studentId) {
      return res.status(403).json({
        message: "You can only see your own doubts",
      });
    }

    const doubts = await Doubt.find({
      studentId: req.params.studentId,
    })
      .populate("tutorId", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(doubts);
  } catch (error) {
    console.log("Get student doubts error:", error.message);

    res.status(500).json({
      message: "Failed to get student doubts",
    });
  }
});

router.patch("/:doubtId/accept", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        message: "Only tutors can accept doubts",
      });
    }

    const { doubtId } = req.params;

    if (!isValidId(doubtId)) {
      return res.status(400).json({
        message: "Invalid doubt id",
      });
    }

    const tutor = await User.findById(req.user.id);

    if (!tutor || tutor.role !== "tutor") {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    const roomId = `studyconnect-${doubtId}`;

    const doubt = await Doubt.findOneAndUpdate(
      {
        _id: doubtId,
        status: "Pending",
      },
      {
        status: "Accepted",
        tutorId: req.user.id,
        roomId: roomId,
      },
      {
        new: true,
      },
    );

    if (!doubt) {
      return res.status(400).json({
        message: "Doubt is already accepted or unavailable",
      });
    }

    const session = await Session.create({
      doubtId: doubt._id,
      studentId: doubt.studentId,
      tutorId: req.user.id,
      roomId: roomId,
      status: "Accepted",
    });

    res.json({
      message: "Doubt accepted successfully",
      doubt,
      session,
    });
  } catch (error) {
    console.log("Accept doubt error:", error.message);

    res.status(500).json({
      message: "Failed to accept doubt",
    });
  }
});

router.patch("/:doubtId/reject", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        message: "Only tutors can reject doubts",
      });
    }

    const { doubtId } = req.params;

    if (!isValidId(doubtId)) {
      return res.status(400).json({
        message: "Invalid doubt id",
      });
    }

    const doubt = await Doubt.findOneAndUpdate(
      {
        _id: doubtId,
        status: "Pending",
      },
      {
        status: "Rejected",
      },
      {
        new: true,
      },
    );

    if (!doubt) {
      return res.status(400).json({
        message: "Doubt is already rejected or unavailable",
      });
    }

    await User.findByIdAndUpdate(doubt.studentId, {
      $inc: {
        availableTokens: doubt.tokenCost,
        reservedTokens: -doubt.tokenCost,
      },
    });

    res.json({
      message: "Doubt rejected and tokens refunded",
      doubt,
    });
  } catch (error) {
    console.log("Reject doubt error:", error.message);

    res.status(500).json({
      message: "Failed to reject doubt",
    });
  }
});

router.get("/:doubtId/session", authMiddleware, async (req, res) => {
  try {
    const { doubtId } = req.params;

    if (!isValidId(doubtId)) {
      return res.status(400).json({
        message: "Invalid doubt id",
      });
    }

    const doubt = await Doubt.findById(doubtId);

    if (!doubt) {
      return res.status(404).json({
        message: "Doubt not found",
      });
    }

    const isStudent =
      req.user.role === "student" && doubt.studentId.toString() === req.user.id;

    const isTutor =
      req.user.role === "tutor" &&
      doubt.tutorId &&
      doubt.tutorId.toString() === req.user.id;

    if (!isStudent && !isTutor) {
      return res.status(403).json({
        message: "You cannot access this session",
      });
    }

    const session = await Session.findOne({
      doubtId,
    })
      .populate("studentId", "name email")
      .populate("tutorId", "name email");

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.json(session);
  } catch (error) {
    console.log("Get session error:", error.message);

    res.status(500).json({
      message: "Failed to get session",
    });
  }
});

router.patch("/:doubtId/start", authMiddleware, async (req, res) => {
  try {
    const { doubtId } = req.params;

    if (!isValidId(doubtId)) {
      return res.status(400).json({
        message: "Invalid doubt id",
      });
    }

    const doubt = await Doubt.findById(doubtId);

    if (!doubt) {
      return res.status(404).json({
        message: "Doubt not found",
      });
    }

    const isStudent =
      req.user.role === "student" && doubt.studentId.toString() === req.user.id;

    const isTutor =
      req.user.role === "tutor" &&
      doubt.tutorId &&
      doubt.tutorId.toString() === req.user.id;

    if (!isStudent && !isTutor) {
      return res.status(403).json({
        message: "You cannot start this doubt",
      });
    }

    if (doubt.status !== "Accepted") {
      return res.status(400).json({
        message: "Doubt cannot be started",
      });
    }

    doubt.status = "In Progress";

    await doubt.save();

    await Session.findOneAndUpdate(
      {
        doubtId,
      },
      {
        status: "In Progress",
      },
    );

    res.json({
      message: "Doubt started successfully",
      doubt,
    });
  } catch (error) {
    console.log("Start doubt error:", error.message);

    res.status(500).json({
      message: "Failed to start doubt",
    });
  }
});

router.patch("/:doubtId/solve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        message: "Only tutors can solve doubts",
      });
    }

    const { doubtId } = req.params;

    if (!isValidId(doubtId)) {
      return res.status(400).json({
        message: "Invalid doubt id",
      });
    }

    const doubt = await Doubt.findOneAndUpdate(
      {
        _id: doubtId,
        tutorId: req.user.id,
        status: {
          $in: ["Accepted", "In Progress"],
        },
      },
      {
        status: "Solved",
      },
      {
        new: true,
      },
    );

    if (!doubt) {
      return res.status(400).json({
        message: "Doubt not found or already solved",
      });
    }

    await User.findByIdAndUpdate(doubt.studentId, {
      $inc: {
        reservedTokens: -doubt.tokenCost,
      },
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        earnedTokens: doubt.tokenCost,
      },
    });

    await Session.findOneAndUpdate(
      {
        doubtId,
      },
      {
        status: "Completed",
        completedAt: new Date(),
      },
    );

    res.json({
      message: "Doubt solved successfully",
      doubt,
    });
  } catch (error) {
    console.log("Solve doubt error:", error.message);

    res.status(500).json({
      message: "Failed to solve doubt",
    });
  }
});

router.get("/wallet/student", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can access wallet",
      });
    }

    const student = await User.findById(req.user.id).select(
      "name email availableTokens reservedTokens",
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    console.log("Student wallet error:", error.message);

    res.status(500).json({
      message: "Failed to get student wallet",
    });
  }
});

router.get("/wallet/tutor", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        message: "Only tutors can access wallet",
      });
    }

    const tutor = await User.findById(req.user.id).select(
      "name email earnedTokens",
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    res.json(tutor);
  } catch (error) {
    console.log("Tutor wallet error:", error.message);

    res.status(500).json({
      message: "Failed to get tutor wallet",
    });
  }
});

module.exports = router;
