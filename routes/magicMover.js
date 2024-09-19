const express = require("express");
const router = express.Router();
const magicMoverController = require("../controllers/magicMovers.js");

router.post("/add", magicMoverController.addMagicMover);
router.post("/:id/load", magicMoverController.loadMagicMover);
router.post("/:id/start", magicMoverController.startMission);
router.post("/:id/end", magicMoverController.endMission);
router.get("/get", magicMoverController.getMoversMissionCompleted);
module.exports = router;
