const mongoose = require("mongoose");

const magicItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});
const MagicItem = mongoose.model("MagicItem", magicItemSchema);

module.exports = MagicItem;
