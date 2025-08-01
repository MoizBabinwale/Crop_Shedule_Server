const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
// import Crop from "../models/Crop.js";

//create Shedule
router.post("/create/:cropId", async (req, res) => {
  try {
    const cropId = req.params.cropId;

    const schedules = req.body;

    // Each schedule will be stored with cropId
    const savedSchedules = await Promise.all(
      schedules.map((data) => {
        return new Schedule({ ...data, cropId }).save();
      })
    );

    res.status(201).json(savedSchedules);
  } catch (error) {
    console.error("Error saving schedule:", error);
    res.status(500).json({ message: "Failed to save schedule", error });
  }
});

module.exports = router;
