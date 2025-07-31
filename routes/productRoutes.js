const express = require("express");

const Product = require("../models/Product");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Incoming product: ", req.body);
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Product name is required" });
    }

    const newProduct = new Product({ name: name.trim() });
    const savedProduct = await newProduct.save();

    console.log("Saved product:", savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Error adding product" });
  }
});

// Get All Products (no crop relation)
router.get("/", async (req, res) => {
  try {
    console.log("get prod");

    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Update Product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
});

// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
});

module.exports = router;
