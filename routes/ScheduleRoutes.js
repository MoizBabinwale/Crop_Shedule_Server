const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
// import Crop from "../models/Crop.js";

// GET /schedule/:cropId
router.get("/get/:cropId", async (req, res) => {
  try {
    const cropId = req.params.cropId;
    const schedule = await Schedule.findOne({ cropId });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    return res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
});

// POST /schedule/create
router.post("/create/:cropId", async (req, res) => {
  try {
    const cropId = req.params.cropId;
    const { weeks } = req.body;

    // Check if schedule already exists
    const existing = await Schedule.findOne({ cropId });

    if (existing) {
      // Update the existing schedule's weeks
      existing.weeks = weeks;
      const updated = await existing.save();
      return res.status(200).json({ message: "Schedule updated", data: updated });
    }

    // Create a new schedule
    const newSchedule = new Schedule({
      cropId,
      weeks,
    });

    const saved = await newSchedule.save();
    res.status(201).json({ message: "Schedule created", data: saved });
  } catch (error) {
    console.error("Error creating/updating schedule:", error);
    res.status(500).json({ message: "Failed to create/update schedule", error });
  }
});

router.post("/schedulebill/create", async (req, res) => {
  try {
    const newBill = new ScheduleBill(req.body);
    const saved = await newBill.save();

    // Optionally update the related schedule with bill ID
    await Schedule.findByIdAndUpdate(req.body.scheduleId, { scheduleBillId: saved._id });

    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Schedule bill creation failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const scheduleId = req.params.id;

    const schedule = await Schedule.findById(scheduleId).populate("cropId");

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching schedule by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
