const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
      required: true,
      index: true,
    },

    tokenCost: {
      type: Number,
      enum: [5, 10, 20],
      default: 5,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Solved", "Completed"],
      default: "Pending",
      index: true,
    },

    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    roomId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

doubtSchema.index({
  status: 1,
  priority: -1,
  createdAt: -1,
});

module.exports = mongoose.model("Doubt", doubtSchema);
