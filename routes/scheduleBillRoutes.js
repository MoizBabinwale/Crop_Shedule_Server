const express = require("express");
const ScheduleBill = require("../models/ScheduleBill");
const Schedule = require("../models/Schedule");
const router = express.Router();

// GET existing Schedule Bill by scheduleId

router.get("/:scheduleId", async (req, res) => {
  try {
    console.log("get jlaskf");

    const bill = await ScheduleBill.findOne({ scheduleId: req.params.scheduleId });
    if (!bill) return res.status(404).json({ message: "No bill found" });
    res.status(200).json(bill);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bill" });
  }
});

// POST or UPDATE Schedule Bill
router.post("/", async (req, res) => {
  try {
    const { scheduleId } = req.body;

    // Check if a bill already exists for this scheduleId
    let existingBill = await ScheduleBill.findOne({ scheduleId });

    if (existingBill) {
      // Update the existing bill
      const updatedBill = await ScheduleBill.findOneAndUpdate({ scheduleId }, req.body, { new: true });

      res.status(200).json(updatedBill);
    } else {
      // Create a new bill
      const newBill = new ScheduleBill(req.body);
      await newBill.save();

      // Link bill ID in Schedule
      await Schedule.findByIdAndUpdate(scheduleId, {
        scheduleBillId: newBill._id,
      });

      res.status(201).json(newBill);
    }
  } catch (err) {
    console.error("Error creating/updating schedule bill:", err);
    res.status(500).json({ error: "Error processing schedule bill" });
  }
});

module.exports = router;
