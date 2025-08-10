const express = require("express");
const router = express.Router();
const Quotation = require("../models/Quotation");

// Create new quotation
router.post("/", async (req, res) => {
  try {
    const newQuotation = await Quotation.create(req.body);
    res.status(201).json(newQuotation);
  } catch (err) {
    // console.error("Quotation creation error:", err);

    // If it's a Mongoose validation error
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    // For other errors
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// Get quotation by ID
router.get("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    res.status(200).json(quotation);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quotation" });
  }
});

// Get all quotations
router.get("/", async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.status(200).json(quotations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quotations" });
  }
});

// Update quotation
router.put("/:id", async (req, res) => {
  try {
    const updated = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update quotation" });
  }
});

// Delete quotation
router.delete("/:id", async (req, res) => {
  try {
    await Quotation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Quotation deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete quotation" });
  }
});

module.exports = router;
