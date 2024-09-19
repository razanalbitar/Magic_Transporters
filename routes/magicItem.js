const express = require("express");
const router = express.Router();
const magicItemController = require("../controllers/magicItems.js");

router.post("/add", magicItemController.addMagicItem);

module.exports = router;
