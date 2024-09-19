const mongoose = require("mongoose");

const magicMoverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weightLimit: {
    type: Number,
    required: true,
  },
  energy: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
    default: 1000,
  },
  questState: {
    type: String,
    enum: ["resting", "loading", "on a mission", "done"],
    default: "resting",
  },
  currentLoad: {
    type: Number,
    default: 0,
  },
  completedMissions: {
    type: Number,
    default: 0,
  },
});
const MagicMover = mongoose.model("MagicMover", magicMoverSchema);

module.exports = MagicMover;
