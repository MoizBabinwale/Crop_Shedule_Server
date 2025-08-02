const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema({
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
    required: true,
  },
  cropName: String,
  acres: Number,
  weeks: [
    {
      weekNumber: Number,
      date: Date,
      perLiter: String,
      waterPerAcre: String,
      totalAcres: String,
      totalWater: String,
      productAmountMg: String,
      productAmountLtr: String,
      useStartDay: String,
      instructions: String,
      products: [
        {
          name: String,
          quantity: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Quotation", quotationSchema);
