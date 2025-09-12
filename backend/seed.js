import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

import Tenant from './models/Tenant.js';
import User from './models/User.js';
import connectDB from './config/db.js';

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Cleaning database...');
    await User.deleteMany({});
    await Tenant.deleteMany({});

    console.log('Seeding tenants...');
    const acme = await Tenant.create({ name: 'Acme', slug: 'acme' });
    const globex = await Tenant.create({ name: 'Globex', slug: 'globex' });

    console.log('Tenants seeded.');

    const password = await bcrypt.hash('password', 10);

    console.log('Seeding users...');
    await User.create([
      { email: 'admin@acme.test', password, role: 'admin', tenantId: acme._id },
      { email: 'user@acme.test', password, role: 'member', tenantId: acme._id },
      { email: 'admin@globex.test', password, role: 'admin', tenantId: globex._id },
      { email: 'user@globex.test', password, role: 'member', tenantId: globex._id },
    ]);
    console.log('Users seeded.');
    console.log('Database seeding complete!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
