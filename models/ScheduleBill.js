// models/ScheduleBill.js
const mongoose = require("mongoose");

const ScheduleBillSchema = new mongoose.Schema(
  {
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", default: null },
    cropId: String,
    cropName: String,
    billDate: Date,
    items: [
      {
        name: String,
        times: Number,
        totalMl: Number,
        ltrKg: Number,
        rate: Number,
        totalAmt: Number,
      },
    ],
    additionalInfo: {
      totalPlants: Number,
      totalAcres: Number,
      totalGuntha: Number,
      totalCost: Number,
      perPlantCost: Number,

      // Cost sections
      leafProductCost: {
        totalRs: Number,
        perHectare: Number,
        perAcre: Number,
        perBigha: Number,
        perGuntha: Number,
      },
      bioControlCost: {
        totalRs: Number,
        perHectare: Number,
        perAcre: Number,
        perBigha: Number,
        perGuntha: Number,
      },
      fieldInputPrepCost: {
        totalRs: Number,
        perHectare: Number,
        perAcre: Number,
        perBigha: Number,
        perGuntha: Number,
      },
      smokeCost: {
        totalRs: Number,
        perHectare: Number,
        perAcre: Number,
        perBigha: Number,
        perGuntha: Number,
      },
    },
    createdBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScheduleBill", ScheduleBillSchema);
