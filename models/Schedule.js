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
      productAmountLtr: String,
      useStartDay: String,
      products: [
        {
          name: String,
          quantity: String,
        },
      ],
      instructions: String,
    },
  ],

  scheduleBillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScheduleBill",
    default: null,
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
