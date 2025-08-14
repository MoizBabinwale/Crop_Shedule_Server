const Quotation = require("../models/Quotation");
const QuotationBill = require("../models/QuotationBill");

const express = require("express");
const ScheduleBill = require("../models/ScheduleBill");
const Schedule = require("../models/Schedule");
const router = express.Router();

router.post("/:quotationId/:acres", async (req, res) => {
  try {
    const { quotationId, acres } = req.params;

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });

    const scheduleId = quotation.scheduleId;
    const scheduleData = await Schedule.findById(scheduleId);
    const scheduleBill = await ScheduleBill.findOne({ scheduleId });
    if (!scheduleBill) return res.status(404).json({ message: "Schedule Bill not found" });
    const productStats = {};

    // Loop through weeks
    scheduleData.weeks.forEach((week) => {
      week.products.forEach((product) => {
        const { name, quantity } = product;

        if (!productStats[name]) {
          productStats[name] = { times: 0, totalMl: 0, ltrKg: 0 };
        }

        // Increment times
        productStats[name].times += 1;

        // Extract ml/g
        const matchMl = quantity?.match(/([\d.]+)\s*ml\/g/i);
        if (matchMl) productStats[name].totalMl += parseFloat(matchMl[1]);

        // Extract l/kg
        const matchLtr = quantity?.match(/([\d.]+)\s*l\/kg/i);
        if (matchLtr) productStats[name].ltrKg += parseFloat(matchLtr[1]);
      });
    });

    // Multiply for acres & match rates from ScheduleBill
    const multipliedItems = Object.keys(productStats).map((name) => {
      const matchingBillItem = scheduleBill.items.find((i) => i.name === name);

      return {
        name,
        times: productStats[name].times,
        totalMl: productStats[name].totalMl * acres,
        ltrKg: productStats[name].ltrKg * acres,
        rate: matchingBillItem?.rate || 0,
        totalAmt: matchingBillItem.totalAmt * acres, // example calc
      };
    });
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
