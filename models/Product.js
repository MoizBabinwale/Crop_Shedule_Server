const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["पर्णनेत्र आयुर्वेदिक एग्रो इनपुट्स", "जैव नियंत्रण उत्पाद", "खेत पर इनपुट", "खेत पर पत्तों से धुवा"],
    required: true,
  },
  pricePerAcre: {
    type: Number,
    required: true,
    min: 0, // Price can't be negative
  },
  rate: { type: Number, required: true, min: 0 },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
