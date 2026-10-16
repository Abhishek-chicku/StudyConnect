const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const Session = require("../models/Session");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function getAvailability(tutor) {
  if (tutor.isAvailable === false) {
    return "Unavailable";
  }

  return "Available";
}

function getSlots(slots) {
  if (!Array.isArray(slots)) {
    return [];
  }

  return slots;
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can find tutors",
      });
    }

    const search = (req.query.search || "").trim();

    const subject = (req.query.subject || "").trim();

    const availability = (req.query.availability || "all").toLowerCase();

    if (!["all", "available", "unavailable"].includes(availability)) {
      return res.status(400).json({
        message: "Invalid availability filter",
      });
    }

    const tutors = await User.find({
      role: "tutor",
    })
      .select(
        "name email subject subjects qualification experience bio isAvailable availabilitySlots isVerified",
      )
      .sort({
        name: 1,
      });

    let filteredTutors = tutors;

    if (search) {
      const searchText = search.toLowerCase();

      filteredTutors = filteredTutors.filter((tutor) => {
        const tutorName = (tutor.name || "").toLowerCase();

        const tutorSubject = (tutor.subject || "").toLowerCase();

        const tutorSubjects = Array.isArray(tutor.subjects)
          ? tutor.subjects
          : [];

        const subjectMatch = tutorSubjects.some((item) =>
          (item || "").toLowerCase().includes(searchText),
        );

        return (
          tutorName.includes(searchText) ||
          tutorSubject.includes(searchText) ||
          subjectMatch
        );
      });
    }

    if (subject) {
      filteredTutors = filteredTutors.filter((tutor) => {
        if (tutor.subject === subject) {
          return true;
        }

        if (Array.isArray(tutor.subjects) && tutor.subjects.includes(subject)) {
          return true;
        }

        return false;
      });
    }

    if (availability === "available") {
      filteredTutors = filteredTutors.filter(
        (tutor) => getAvailability(tutor) === "Available",
      );
    }

    if (availability === "unavailable") {
      filteredTutors = filteredTutors.filter(
        (tutor) => getAvailability(tutor) === "Unavailable",
      );
    }

    const subjectList = [];

    tutors.forEach((tutor) => {
      if (tutor.subject && !subjectList.includes(tutor.subject)) {
        subjectList.push(tutor.subject);
      }

      if (Array.isArray(tutor.subjects)) {
        tutor.subjects.forEach((item) => {
          if (item && !subjectList.includes(item)) {
            subjectList.push(item);
          }
        });
      }
    });

    subjectList.sort();

    const tutorList = filteredTutors.map((tutor) => {
      const tutorSubjects = [];

      if (tutor.subject) {
        tutorSubjects.push(tutor.subject);
      }

      if (Array.isArray(tutor.subjects)) {
        tutor.subjects.forEach((item) => {
          if (item && !tutorSubjects.includes(item)) {
            tutorSubjects.push(item);
          }
        });
      }

      return {
        _id: tutor._id,

        id: tutor._id,

        name: tutor.name || "Tutor",

        email: tutor.email || "",

        subject: tutor.subject || "",

        subjects: tutorSubjects,

        qualification: tutor.qualification || "",

        experience: tutor.experience || "",

        bio: tutor.bio || "",

        isAvailable: tutor.isAvailable === false ? false : true,

        availability: getAvailability(tutor),

        availabilitySlots: getSlots(tutor.availabilitySlots),

        isVerified: tutor.isVerified === true,
      };
    });

    return res.json({
      tutors: tutorList,
      subjects: subjectList,
      count: tutorList.length,
    });
  } catch (error) {
    console.log("Get tutors error:", error.message);

    return res.status(500).json({
      message: "Failed to get tutors",
    });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        message: "Only tutors can view their profile",
      });
    }

    const tutor = await User.findOne({
      _id: req.user.id,
      role: "tutor",
    }).select(
      "name email subject subjects qualification experience bio isAvailable availabilitySlots isVerified",
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    const tutorSubjects = [];

    if (tutor.subject) {
      tutorSubjects.push(tutor.subject);
    }

    if (Array.isArray(tutor.subjects)) {
      tutor.subjects.forEach((item) => {
        if (item && !tutorSubjects.includes(item)) {
          tutorSubjects.push(item);
        }
      });
    }

    const completedSessions = await Session.countDocuments({
      tutorId: tutor._id,
      status: "Completed",
    });

    return res.json({
      _id: tutor._id,

      id: tutor._id,

      name: tutor.name || "Tutor",

      email: tutor.email || "",

      subject: tutor.subject || "",

      subjects: tutorSubjects,

      qualification: tutor.qualification || "",

      experience: tutor.experience || "",

      bio: tutor.bio || "",

      isAvailable: tutor.isAvailable === false ? false : true,

      availability: getAvailability(tutor),

      availabilitySlots: getSlots(tutor.availabilitySlots),

      isVerified: tutor.isVerified === true,

      completedSessions: completedSessions,
    });
  } catch (error) {
    console.log("Get my tutor profile error:", error.message);

    return res.status(500).json({
      message: "Failed to get my tutor profile",
    });
  }
});

router.get("/:tutorId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can view tutor profiles",
      });
    }

    const { tutorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(400).json({
        message: "Invalid tutor ID",
      });
    }

    const tutor = await User.findOne({
      _id: tutorId,
      role: "tutor",
    }).select(
      "name email subject subjects qualification experience bio isAvailable availabilitySlots isVerified",
    );

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    const tutorSubjects = [];

    if (tutor.subject) {
      tutorSubjects.push(tutor.subject);
    }

    if (Array.isArray(tutor.subjects)) {
      tutor.subjects.forEach((item) => {
        if (item && !tutorSubjects.includes(item)) {
          tutorSubjects.push(item);
        }
      });
    }

    const completedSessions = await Session.countDocuments({
      tutorId: tutor._id,
      status: "Completed",
    });

    return res.json({
      _id: tutor._id,

      id: tutor._id,

      name: tutor.name || "Tutor",

      email: tutor.email || "",

      subject: tutor.subject || "",

      subjects: tutorSubjects,

      qualification: tutor.qualification || "",

      experience: tutor.experience || "",

      bio: tutor.bio || "",

      isAvailable: tutor.isAvailable === false ? false : true,

      availability: getAvailability(tutor),

      availabilitySlots: getSlots(tutor.availabilitySlots),

      isVerified: tutor.isVerified === true,

      completedSessions: completedSessions,
    });
  } catch (error) {
    console.log("Get tutor profile error:", error.message);

    return res.status(500).json({
      message: "Failed to get tutor profile",
    });
  }
});

router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        message: "Only tutors can update profile",
      });
    }

    const {
      qualification,
      experience,
      subjects,
      bio,
      isAvailable,
      availabilitySlots,
    } = req.body;

    if (qualification !== undefined && typeof qualification !== "string") {
      return res.status(400).json({
        message: "Qualification must be a text value",
      });
    }

    if (experience !== undefined && typeof experience !== "string") {
      return res.status(400).json({
        message: "Experience must be a text value",
      });
    }

    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({
        message: "Bio must be a text value",
      });
    }

    if (subjects !== undefined && !Array.isArray(subjects)) {
      return res.status(400).json({
        message: "Subjects must be an array",
      });
    }

    if (isAvailable !== undefined && typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "Availability must be true or false",
      });
    }

    if (availabilitySlots !== undefined && !Array.isArray(availabilitySlots)) {
      return res.status(400).json({
        message: "Availability slots must be an array",
      });
    }

    if (Array.isArray(availabilitySlots)) {
      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

      for (const slot of availabilitySlots) {
        if (!slot || typeof slot !== "object") {
          return res.status(400).json({
            message: "Invalid availability slot",
          });
        }

        if (!validDays.includes(slot.day)) {
          return res.status(400).json({
            message: "Invalid day in availability slot",
          });
        }

        if (
          typeof slot.startTime !== "string" ||
          typeof slot.endTime !== "string"
        ) {
          return res.status(400).json({
            message: "Slot times must be text values",
          });
        }

        if (
          !timePattern.test(slot.startTime) ||
          !timePattern.test(slot.endTime)
        ) {
          return res.status(400).json({
            message: "Use time format HH:MM",
          });
        }

        if (slot.startTime >= slot.endTime) {
          return res.status(400).json({
            message: "Start time must be before end time",
          });
        }
      }
    }

    const tutor = await User.findOne({
      _id: req.user.id,
      role: "tutor",
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    if (qualification !== undefined) {
      tutor.qualification = qualification.trim();
    }

    if (experience !== undefined) {
      tutor.experience = experience.trim();
    }

    if (bio !== undefined) {
      tutor.bio = bio.trim();
    }

    if (subjects !== undefined) {
      tutor.subjects = subjects
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    if (isAvailable !== undefined) {
      tutor.isAvailable = isAvailable;
    }

    if (availabilitySlots !== undefined) {
      tutor.availabilitySlots = availabilitySlots.map((slot) => ({
        day: slot.day,

        startTime: slot.startTime,

        endTime: slot.endTime,
      }));
    }

    await tutor.save();

    return res.json({
      message: "Tutor profile updated successfully",

      tutor: {
        _id: tutor._id,

        id: tutor._id,

        name: tutor.name || "Tutor",

        email: tutor.email || "",

        subject: tutor.subject || "",

        subjects: tutor.subjects || [],

        qualification: tutor.qualification || "",

        experience: tutor.experience || "",

        bio: tutor.bio || "",

        isAvailable: tutor.isAvailable === false ? false : true,

        availability: getAvailability(tutor),

        availabilitySlots: getSlots(tutor.availabilitySlots),

        isVerified: tutor.isVerified === true,
      },
    });
  } catch (error) {
    console.log("Update tutor profile error:", error.message);

    return res.status(500).json({
      message: "Failed to update tutor profile",
    });
  }
});

module.exports = router;
