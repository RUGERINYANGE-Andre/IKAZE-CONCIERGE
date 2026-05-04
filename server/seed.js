// server/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const adminPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ikazeconcierge.com',
      phone: '+250789765744',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('✅ Admin user created');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);

    // Create Services
    const services = [
      {
        serviceId: 'planning-hub',
        name: 'Planning Hub',
        tagline: 'Pre-Visit Intelligence',
        description: 'Perfect for independent travelers who want professional planning support.',
        price: 150,
        currency: 'USD',
        features: [
          'Custom itinerary design',
          'Accommodation suggestions',
          'Transport logistics plan',
          'Permit checklist (Irembo guidance)',
          'Digital planning document',
        ],
        icon: '📋',
        popular: false,
        isActive: true,
      },
      {
        serviceId: 'onsite-manager',
        name: 'Onsite Manager',
        tagline: 'Your Rwanda Navigator',
        description: 'Ideal for diaspora returns and first-time visitors.',
        price: 400,
        currency: 'USD',
        features: [
          'Everything in Planning Hub',
          'Dedicated concierge for your visit',
          'Transport coordination',
          'On-ground troubleshooting',
          'Daily check-ins',
        ],
        icon: '🧭',
        popular: true,
        isActive: true,
      },
      {
        serviceId: 'full-memory',
        name: 'Full Memory',
        tagline: 'Complete Experience Package',
        description: 'Premium package for special occasions and research documentation.',
        price: 750,
        currency: 'USD',
        features: [
          'Everything in Onsite Manager',
          'Professional photography',
          'Video highlights',
          'Digital photo album',
          'Post-visit summary report',
          'Curated memory package',
        ],
        icon: '📸',
        popular: false,
        isActive: true,
      },
    ];

    await Service.insertMany(services);
    console.log('✅ Services created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@ikazeconcierge.com / Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();