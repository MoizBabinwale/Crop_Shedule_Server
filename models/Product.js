const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  pricePerAcre: {
    type: Number,
    required: true,
    min: 0, // Price can't be negative
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
