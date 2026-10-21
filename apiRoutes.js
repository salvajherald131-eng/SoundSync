
const express = require("express");
const router = express.Router();

const controller = require("../controllers/soundSyncController");

router.get("/songs", controller.getSongs);
router.get("/songs/:id", controller.getSong);
router.post("/songs", controller.addSong);
router.delete("/songs/:id", controller.removeSong);

module.exports = router;
