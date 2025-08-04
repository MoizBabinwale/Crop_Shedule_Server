const QuotationBill = require("../models/QuotationBill");

const express = require("express");
const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    console.log("req.body ", req.body);

    const newBill = new QuotationBill(req.body);
    const saved = await newBill.save();
    res.status(201).json(saved._id);
  } catch (err) {
    res.status(500).json({ error: "Failed to save quotation bill" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bill = await QuotationBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.status(200).json(bill);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ message: "Failed to fetch bill" });
  }
});

module.exports = router;
