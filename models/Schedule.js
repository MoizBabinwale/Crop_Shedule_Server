const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
    required: true,
  },
  weeks: [
    {
      weekNumber: Number,
      date: Date,
      perLiter: String,
      waterPerAcre: String,
      totalAcres: String,
      totalWater: String,
      productAmountMg: String,
      productAmountLitre: String,
      usageDays: String,
      products: [
        {
          name: String,
          quantity: String,
        },
      ],
      instructions: String,
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
