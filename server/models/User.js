const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
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

    qualification: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
      maxlength: 50,
    },

    subjects: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    availabilitySlots: {
      type: [
        {
          day: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            required: true,
          },

          startTime: {
            type: String,
            required: true,
            trim: true,
          },

          endTime: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      default: [],
    },

    isVerified: {
      type: Boolean,
      default: false,
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
