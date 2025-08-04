const mongoose = require("mongoose");

const quotationBillSchema = new mongoose.Schema(
  {
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },
    farmerInfo: {
      name: String,
      place: String,
      tahsil: String,
      district: String,
      state: String,
    },
    acres: Number,
    products: [
      {
        name: String,
        times: Number,
        quantity: Number,
        unit: String, // ml/kg
        rate: Number,
        totalAmount: Number,
      },
    ],
    totalCost: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuotationBill", quotationBillSchema);
