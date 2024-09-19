const MagicMover = require("../models/magicMover.js");
const MagicItem = require("../models/magicItem.js");
const logger = require("../logs/logger.js");

const addMagicMover = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    let magicMover = req.body;
    const newMagicMover = new MagicMover(magicMover);

    const savedMagicMover = await newMagicMover.save();
    logger.info(`Magic Mover added: ${savedMagicMover._id}`);

    if (!savedMagicMover) {
      return res.status(500).json({ message: "Creation failed" });
    }

    const magicMoverDto = {
      moverId: savedMagicMover._id,
      name: savedMagicMover.name,
      weightLimit: savedMagicMover.weightLimit,
      energy: savedMagicMover.energy,
      questState: savedMagicMover.questState,
      completedMissions: savedMagicMover.completedMissions,
      currentLoad: savedMagicMover.currentLoad,
    };

    res.status(201).json(magicMoverDto);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ errors: errorMessages });
    }

    res.status(500).json({ message: "Server error" });
  }
};

const loadMagicMover = async (req, res) => {
  try {
    console.log("ID:", req.params.id);
    let moverId = req.params.id;
    const magicMover = await MagicMover.findById(moverId);
    if (!magicMover) {
      return res.status(404).json({ message: "Magic mover not found" });
    }

    if (magicMover.questState == "on a mission") {
      return res.status(400).json({
        message: "Cannot load ! Magic mover is currently on a mission.",
      });
    }

    let itemsToLoad = req.body.items;
    let totalItemsCount = itemsToLoad.length;

    let totalItemsEnergy = 0;
    for (const ItemId of itemsToLoad) {
      const magicItem = await MagicItem.findById(ItemId);
      if (magicItem) {
        totalItemsEnergy += magicItem.weight;
      } else {
        return res
          .status(404)
          .json({ error: `Item with ID ${ItemId} not found` });
      }
    }

    if (totalItemsEnergy > magicMover.energy) {
      return res
        .status(400)
        .json({ error: "Cannot load, exceeds energy limit" });
    }

    magicMover.questState = "loading";
    magicMover.currentLoad += totalItemsCount;
    magicMover.energy -= totalItemsEnergy;
    await magicMover.save();

    logger.info(`Magic Mover ${moverId} loaded with ${totalItemsCount} items.`);

    res.status(201).json(magicMover);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ errors: errorMessages });
    }

    res.status(500).json({ message: "Server error" });
  }
};

const startMission = async (req, res) => {
  try {
    console.log("ID:", req.params.id);
    let moverId = req.params.id;
    const magicMover = await MagicMover.findById(moverId);
    if (!magicMover) {
      return res.status(404).json({ message: "Magic mover not found" });
    }

    console.log(magicMover.questState);
    if (magicMover.questState === "on a mission") {
      return res.status(400).json({
        error: "Magic Mover has already on a mission",
      });
    }
    if (magicMover.questState !== "loading") {
      return res.status(400).json({
        error: "Mission cannot be started! Magic mover is not in loading state",
      });
    }
    magicMover.questState = "on a mission";
    await magicMover.save();

    logger.info(`Magic Mover ${moverId} started a mission.`);
    res.status(200).json({ message: "Mission started successfully." });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ errors: errorMessages });
    }

    res.status(500).json({ message: "Server error" });
  }
};

const endMission = async (req, res) => {
  try {
    console.log("ID:", req.params.id);
    let moverId = req.params.id;
    const magicMover = await MagicMover.findById(moverId);
    if (!magicMover) {
      return res.status(404).json({ message: "Magic mover not found" });
    }

    console.log(magicMover.questState);
    if (magicMover.questState === "done") {
      return res.status(400).json({
        error: "Magic Mover has already completed the mission",
      });
    }
    if (magicMover.questState !== "on a mission") {
      return res.status(400).json({
        error: "Mission cannot be ended! Magic mover is not on a mission",
      });
    }
    magicMover.energy = 1000;
    magicMover.questState = "done";
    magicMover.completedMissions += 1;
    magicMover.currentLoad = 0;
    await magicMover.save();

    logger.info(`Magic Mover ${moverId} completed a mission.`);
    res.status(200).json({ message: "Mission ended successfully." });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ errors: errorMessages });
    }

    res.status(500).json({ message: "Server error" });
  }
};
const getMoversMissionCompleted = async (req, res) => {
  try {
    const magicMovers = await MagicMover.find({
      completedMissions: { $gt: 0 },
    }).sort({
      completedMissions: -1,
    });
    res.status(200).json(magicMovers);
  } catch (error) {
    console.error(error);
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
  addMagicMover,
  loadMagicMover,
  startMission,
  endMission,
  getMoversMissionCompleted,
};
