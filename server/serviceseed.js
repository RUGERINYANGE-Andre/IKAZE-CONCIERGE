// server/scripts/seedServices.js
// Run once: node server/scripts/seedServices.js

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Service  = require('./models/Service');

const SERVICES = [
  {
    serviceId:   'a',
    name:        'Essential Entry',
    tagline:     'Single IremboGov process, professionally handled.',
    description: 'A single government service navigated correctly the first time. From document checklist to submission, confirmation, and a digital delivery file.',
    price:       150,
    currency:    'USD',
    timeline:    '24–72 Hours',
    icon:        'fa-file-contract',
    features: [
      'Single IremboGov service navigation',
      'Document checklist within 24 hours',
      'Submission within 48 hours of receipt',
      'Digital delivery file',
      '14-day post-delivery support',
    ],
    popular:  false,
    isActive: true,
  },
  {
    serviceId:   'b',
    name:        'Business Setup',
    tagline:     'Full RDB registration. End-to-end.',
    description: 'Complete end-to-end Rwanda Development Board registration management. We handle every step from company structure selection to obtaining your trading licence.',
    price:       450,
    currency:    'USD',
    timeline:    '5–7 Business Days',
    icon:        'fa-building-columns',
    features: [
      'Full RDB company registration',
      'TIN & trading licence',
      'Bank account introduction',
      '60-minute strategy session',
      '30-day post-registration support',
    ],
    popular:  true,
    isActive: true,
  },
  {
    serviceId:   'c',
    name:        'NGO Setup',
    tagline:     'Rwanda Governance Board registration, precisely managed.',
    description: 'RGB registration is complex and multi-step. We navigate every requirement from articles of association to Ministry of Local Government alignment.',
    price:       750,
    currency:    'USD',
    timeline:    '7–14 Business Days',
    icon:        'fa-people-group',
    features: [
      'RGB registration management',
      'Pre-application error audit',
      'Documentation preparation & review',
      'Ministry alignment support',
      '45-day post-registration support',
    ],
    popular:  false,
    isActive: true,
  },
  {
    serviceId:   'd',
    name:        'VIP Relocation',
    tagline:     'Full-service entry. From the tarmac to settled.',
    description: 'From the moment your flight lands to the day you feel settled — we manage every detail including accommodation, banking, SIM cards, and all documentation.',
    price:       1500,
    currency:    'USD',
    timeline:    'From arrival day',
    icon:        'fa-star',
    features: [
      'Airport arrival & first-day logistics',
      'Vetted accommodation coordination',
      'Banking, SIM & mobile money setup',
      'Full immigration support',
      '60-day dedicated support',
    ],
    popular:  false,
    isActive: true,
  },
];

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set in your .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const svcData of SERVICES) {
      const exists = await Service.findOne({ serviceId: svcData.serviceId });
      if (exists) {
        // Update in place so existing orders referencing this _id still work
        await Service.findByIdAndUpdate(exists._id, svcData, { runValidators: true });
        console.log(`↻  Updated: ${svcData.name}`);
      } else {
        await Service.create(svcData);
        console.log(`+  Created: ${svcData.name}`);
      }
    }

    console.log('\n✅ Seed complete. Services in DB:');
    const all = await Service.find({}, 'serviceId name price isActive');
    all.forEach(s => console.log(`   [${s.serviceId}] ${s.name} — $${s.price} (active: ${s.isActive})`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();