import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models';

const createSuperAdmin = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGO_URI as string);
  const existing = await User.findOne({ email: 'admin@tenantflow.dev' });
  if (existing) {
    console.log('Superadmin already exists');
    process.exit(0);
  }
  await User.create({ name: 'Super Admin', email: 'admin@tenantflow.dev', password: 'superadmin123', isEmailVerified: true, role: 'superadmin' });
  console.log('Superadmin created: admin@tenantflow.dev / superadmin123');
  process.exit(0);
};

createSuperAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
