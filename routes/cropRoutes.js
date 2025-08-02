const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const Schedule = require("../models/Schedule");
const Quotation = require("../models/Quotation");

// POST - Add new crop
router.post("/add", async (req, res) => {
  try {
    const { name, weeks } = req.body;
    const newCrop = new Crop({ name, weeks });
    await newCrop.save();
    res.status(201).json({ message: "Crop added successfully", newCrop });
  } catch (error) {
    res.status(500).json({ error: "Error adding crop" });
  }
});

// ==============================
// ✅ QUOTATION ROUTES (STATIC)
// ==============================

// GET all quotations
router.get("/quotations", async (req, res) => {
  try {
    const quotations = await Quotation.find();
    res.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ error: "Error fetching quotations" });
  }
});

// GET single quotation
router.get("/quotations/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ error: "Quotation not found" });
    res.json(quotation);
  } catch (err) {
    console.error("Fetch quotation failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST - Create new quotation
router.post("/quotations", async (req, res) => {
  try {
    const quotation = await Quotation.create(req.body);
    res.status(201).json(quotation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create quotation" });
  }
});
// DELETE - Delete a crop and its schedules
router.delete("/quotations/:id", async (req, res) => {
  try {
    const quotationId = req.params.id;
    await Quotation.findByIdAndDelete(quotationId);
    res.json({ message: "Quotation deleted successfully" });
  } catch (error) {
    console.error("Error deleting Quotation:", error);
    res.status(500).json({ error: "Error deleting Quotation" });
  }
});

// ===========================
// ✅ CROP ROUTES (DYNAMIC)
// ===========================

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
