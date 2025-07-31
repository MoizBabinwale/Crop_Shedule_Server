const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
// import Crop from "../models/Crop.js";

//create Shedule
router.post("/create", async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    const saved = await newSchedule.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error saving schedule:", error);
    res.status(500).json({ message: "Failed to save schedule", error });
  }
});

module.exports = router;
