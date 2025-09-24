const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const Schedule = require("../models/Schedule");
const Quotation = require("../models/Quotation");

// POST - Add new crop
router.post("/add", async (req, res) => {
  try {
    const { name, description, weeks, weekInterval } = req.body;
    const newCrop = new Crop({ name, description, weeks, weekInterval });
    await newCrop.save();
    res.status(201).json({ message: "Crop added successfully", newCrop });
  } catch (error) {
    res.status(500).json({ error: "Error adding crop" });
  }
});

// GET all crops
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    console.error("Error fetching crops:", error);
    res.status(500).json({ error: "Error fetching crops" });
  }
});

// GET single crop
router.get("/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching crop", error });
  }
});

// PUT - Update a crop
router.put("/:id", async (req, res) => {
  try {
    const updatedCrop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCrop);
  } catch (error) {
    res.status(500).json({ error: "Failed to update crop" });
  }
});

// DELETE - Delete a crop and its schedules
router.delete("/:id", async (req, res) => {
  try {
    const cropId = req.params.id;
    await Crop.findByIdAndDelete(cropId);
    await Schedule.deleteOne({ cropId }); // or deleteMany if multiple schedules per crop
    res.json({ message: "Crop and associated schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting crop and schedule:", error);
    res.status(500).json({ error: "Error deleting crop and schedule" });
  }
});

module.exports = router;
