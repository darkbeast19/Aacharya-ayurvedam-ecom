const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const addProduct = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecom');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    const newProduct = new Product({
      name: "Pure Himalayan Shilajit Resin",
      category: "Vitality & Strength",
      price: 85.00,
      image: "https://images.unsplash.com/photo-1611078488936-e8e24c2ed2e8?auto=format&fit=crop&q=80&w=600",
      description: "Sourced from high altitudes of the Himalayas, this pure Shilajit resin is rich in fulvic acid and trace minerals. Increases stamina, cognitive health, and balances all doshas.",
      ingredients: "100% Pure Himalayan Shilajit Resin",
      dosha: "Tridoshic",
      countInStock: 25
    });

    await newProduct.save();
    console.log(`✅ Product 'Pure Himalayan Shilajit' added successfully!`);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

addProduct();
