const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: "Ashwagandha Extract",
    category: "Stress Relief",
    price: 35.00,
    image: "/images/ashwagandha.png",
    description: "An ancient adaptogen that helps your body manage stress, enhances brain function and helps to alleviate symptoms of anxiety.",
    ingredients: "Organic Ashwagandha Root Extract (Withania somnifera)",
    dosha: "Vata, Kapha",
    countInStock: 50
  },
  {
    name: "Triphala Powder",
    category: "Digestive Health",
    price: 28.00,
    image: "/images/triphala.png",
    description: "A traditional herbal blend supporting gentle detoxification, digestive health and overall robust vitality.",
    ingredients: "Amla, Bibhitaki, Haritaki",
    dosha: "Tridoshic (All)",
    countInStock: 50
  },
  {
    name: "Brahmi Hair Oil",
    category: "Hair Care",
    price: 42.00,
    image: "/images/brahmi.png",
    description: "Deeply nourishing botanical oil that stimulates the scalp, reduces stress, and promotes thick, healthy hair growth.",
    ingredients: "Brahmi Extract, Coconut Oil, Sesame Oil, Rosemary",
    dosha: "Pitta",
    countInStock: 30
  },
  {
    name: "Chyawanprash",
    category: "Immunity",
    price: 45.00,
    image: "/images/chyawanprash.png",
    description: "A powerful immunity booster and antioxidant rich jam.",
    ingredients: "Amla, Ghee, Honey, Herbs",
    dosha: "Tridoshic",
    countInStock: 20
  }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecom');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create([
      { name: 'Admin User', email: 'admin@example.com', password: 'password', isAdmin: true },
      { name: 'Test User', email: 'user@example.com', password: 'password', isAdmin: false }
    ]);

    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
