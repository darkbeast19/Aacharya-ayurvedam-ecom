const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    ingredients: {
      type: String,
    },
    dosha: {
      type: String,
    },
    estimatedDelivery: {
      type: String,
    },
    returnExchangeInfo: {
      type: String,
    },
    cancellationRefundInfo: {
      type: String,
    },
    additionalInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
