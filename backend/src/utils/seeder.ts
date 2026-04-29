import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const defaultAdmin = new User({
        name: 'Ravi Admin',
        email: process.env.DEFAULT_ADMIN_EMAIL,
        phone: '0000000000',
        password: process.env.DEFAULT_ADMIN_PASSWORD ,
        role: 'admin',
      });
      await defaultAdmin.save();
      console.log('✅ Default admin user created. (' + (process.env.DEFAULT_ADMIN_EMAIL || 'admin@raviinfotech.com') + ')');
    } else {
        console.log('✅ Admin user already exists. Skipping seed.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
