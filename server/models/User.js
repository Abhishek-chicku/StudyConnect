const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "tutor"],
      default: "student",
      required: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    availableTokens: {
      type: Number,
      default: 100,
      min: 0,
    },

    reservedTokens: {
      type: Number,
      default: 0,
      min: 0,
    },

    earnedTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
