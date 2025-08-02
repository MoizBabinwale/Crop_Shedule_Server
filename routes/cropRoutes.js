const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const Schedule = require("../models/Schedule");

// POST - Add new crop
router.post("/add", async (req, res) => {
  try {
    console.log("dd ", req.body);

    const { name, weeks } = req.body;
    const newCrop = new Crop({ name, weeks });
    await newCrop.save();
    res.status(201).json({ message: "Crop added successfully", newCrop });
  } catch (error) {
    res.status(500).json({ error: "Error adding crop" });
  }
});

// GET - Get all crops
router.get("/", async (req, res) => {
  try {
    console.log("get  vrop");

    const crops = await Crop.find();
    console.log("crops ", crops);

    res.json(crops);
  } catch (error) {
    console.log("erro ", error);

    res.status(500).json({ error: "Error fetching crops" });
  }
});

// Update a crop
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

    // Delete the crop
    await Crop.findByIdAndDelete(cropId);

    // Delete associated schedules
    await Schedule.deleteOne({ cropId }); // ❗ use deleteOne if 1 schedule per crop
    // use deleteMany({ cropId }) if you had multiple schedules per crop

    res.json({ message: "Crop and associated schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting crop and schedule:", error);
    res.status(500).json({ error: "Error deleting crop and schedule" });
  }
});

// GET /crop/:id
router.get("/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching crop", error });
  }
});

module.exports = router;
