const mongoose = require("mongoose");

const TrainingClassSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    scheduleAt: {
  type: Date,
  required: true
},

    description: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingClass", TrainingClassSchema);
