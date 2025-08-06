const Quotation = require("../models/Quotation");
const QuotationBill = require("../models/QuotationBill");

const express = require("express");
const ScheduleBill = require("../models/ScheduleBill");
const router = express.Router();

router.post("/:quotationId/:acres", async (req, res) => {
  try {
    const { quotationId, acres } = req.params;
    console.log(" quotationId, acres  ", req.params);

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });

    const scheduleId = quotation.scheduleId;
    const scheduleBill = await ScheduleBill.findOne({ scheduleId });
    if (!scheduleBill) return res.status(404).json({ message: "Schedule Bill not found" });

    // Multiply the items
    const multipliedItems = scheduleBill.items.map((item) => ({
      name: item.name,
      times: item.times,
      totalMl: item.totalMl * acres,
      ltrKg: item.ltrKg * acres,
      rate: item.rate,
      totalAmt: item.totalAmt * acres,
    }));

    // Multiply the cost info
    const multiplyCost = (costObj) => ({
      totalRs: (costObj.totalRs || 0) * acres,
      perHectare: costObj.perHectare,
      perAcre: costObj.perAcre,
      perBigha: costObj.perBigha,
      perGuntha: costObj.perGuntha,
    });

    const newQuotationBill = new QuotationBill({
      quotationId: quotation._id,
      scheduleId: scheduleBill.scheduleId,
      cropId: scheduleBill.cropId,
      cropName: scheduleBill.cropName,
      billDate: new Date(),
      acres: Number(acres),
      items: multipliedItems,
      additionalInfo: {
        totalPlants: (scheduleBill.additionalInfo.totalPlants || 0) * acres,
        totalAcres: Number(acres),
        totalGuntha: (scheduleBill.additionalInfo.totalGuntha || 0) * acres,
        totalCost: (scheduleBill.additionalInfo.totalCost || 0) * acres,
        perPlantCost: scheduleBill.additionalInfo.perPlantCost || 0,
        leafProductCost: multiplyCost(scheduleBill.additionalInfo.leafProductCost),
        bioControlCost: multiplyCost(scheduleBill.additionalInfo.bioControlCost),
        fieldInputPrepCost: multiplyCost(scheduleBill.additionalInfo.fieldInputPrepCost),
        smokeCost: multiplyCost(scheduleBill.additionalInfo.smokeCost),
      },
      farmerInfo: quotation.farmerInfo,
    });

    await newQuotationBill.save();
    return res.status(201).json({ message: "Quotation bill created", bill: newQuotationBill });
  } catch (error) {
    console.error("Error creating quotation bill:", error);
    return res.status(500).json({ message: "Server error" });
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
