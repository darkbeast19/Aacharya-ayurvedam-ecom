const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin';

    if (!email || !password) {
      console.log('❌ Please provide email and password arguments.');
      console.log('Usage: node createAdmin.js <email> <password> [name]');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecom');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    const userExists = await User.findOne({ email });
    if (userExists) {
      userExists.isAdmin = true;
      userExists.password = password; // Overwrite with new password
      await userExists.save();
      console.log(`✅ Existing user ${email} upgraded to Admin successfully!`);
    } else {
      await User.create({
        name,
        email,
        password,
        isAdmin: true
      });
      console.log(`✅ New Admin user ${email} created successfully!`);
    }

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
