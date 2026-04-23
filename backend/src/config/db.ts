import mongoose from 'mongoose';

// using this  USE_GOOGLE_DNS=true in your .env to enable this fix.
if (process.env.USE_GOOGLE_DNS === 'true') {
  const dns = require('node:dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(uri);
    // console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;