const MagicItem = require("../models/magicItem.js");

const addMagicItem = async (req, res) => {
  try {
    console.log("Request Body: ", req.body);

    let magicItem = req.body;
    const newMagicItem = new MagicItem(magicItem);

    const savedMagicItem = await newMagicItem.save();

    if (!savedMagicItem) {
      return res.status(500).json({ message: "Creation failed" });
    }

    const magicItemDto = {
      ItemId: savedMagicItem._id,
      name: savedMagicItem.name,
      weight: savedMagicItem.weight,
    };

    res.status(201).json(magicItemDto);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ errors: errorMessages });
    }

    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  addMagicItem,
};
