const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");

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

router.delete("/:id", async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
});
module.exports = router;
