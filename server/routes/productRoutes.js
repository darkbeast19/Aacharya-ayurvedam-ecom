const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name || 'Sample name',
      price: req.body.price || 0,
      user: req.user._id,
      image: req.body.image || '/images/sample.jpg',
      category: req.body.category || 'Sample category',
      countInStock: req.body.countInStock || 0,
      description: req.body.description || 'Sample description',
      ingredients: req.body.ingredients || '',
      dosha: req.body.dosha || '',
      estimatedDelivery: req.body.estimatedDelivery || '',
      returnExchangeInfo: req.body.returnExchangeInfo || '',
      cancellationRefundInfo: req.body.cancellationRefundInfo || '',
      additionalInfo: req.body.additionalInfo || '',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { 
    name, price, description, image, category, countInStock, ingredients, dosha,
    estimatedDelivery, returnExchangeInfo, cancellationRefundInfo, additionalInfo 
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.category = category;
      product.countInStock = countInStock;
      product.ingredients = ingredients;
      product.dosha = dosha;
      if (estimatedDelivery !== undefined) product.estimatedDelivery = estimatedDelivery;
      if (returnExchangeInfo !== undefined) product.returnExchangeInfo = returnExchangeInfo;
      if (cancellationRefundInfo !== undefined) product.cancellationRefundInfo = cancellationRefundInfo;
      if (additionalInfo !== undefined) product.additionalInfo = additionalInfo;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
