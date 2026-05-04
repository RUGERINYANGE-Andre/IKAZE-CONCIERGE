// client/src/utils/constants.js

// ========================================
// 🎨 DESIGN SYSTEM - COLORS
// ========================================
export const COLORS = {
  primary: {
    teal: '#1BA19C',
    tealLight: '#5BC4BF',
    tealDark: '#158B87',
  },
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F9FAFB',
    lightGray: '#E5E7EB',
    gray: '#9CA3AF',
    darkGray: '#4B5563',
    navy: '#1F2937',
    darkNavy: '#111827',
  },
  status: {
    pending: '#F59E0B',
    inProgress: '#3B82F6',
    completed: '#10B981',
    cancelled: '#EF4444',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #1BA19C 0%, #158B87 100%)',
    overlay: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
  }
};

// ========================================
// 🛎️ SERVICES CONFIGURATION
// ========================================
export const SERVICES = [
  {
    id: 'planning-hub',
    name: 'Planning Hub',
    tagline: 'Pre-Visit Intelligence',
    description: 'Perfect for independent travelers who want professional planning support without on-ground assistance.',
    price: 150,
    currency: 'USD',
    features: [
      'Custom itinerary design',
      'Accommodation suggestions',
      'Transport logistics plan',
      'Permit checklist (Irembo guidance)',
      'Digital planning document',
    ],
    deliverables: [
      'Detailed PDF itinerary',
      'Accommodation recommendations with booking links',
      'Transport coordination guide',
      'Permit application checklist',
      'Emergency contacts list',
    ],
    idealFor: [
      'Independent travelers',
      'Budget-conscious planners',
      'DIY enthusiasts',
      'Repeat visitors',
    ],
    icon: '📋',
    popular: false,
    estimatedDelivery: '3-5 business days',
  },
  {
    id: 'onsite-manager',
    name: 'Onsite Manager',
    tagline: 'Your Rwanda Navigator',
    description: 'Comprehensive support from planning through your entire visit. Your dedicated concierge handles everything.',
    price: 400,
    currency: 'USD',
    features: [
      'Everything in Planning Hub',
      'Dedicated concierge for your visit',
      'Transport coordination',
      'On-ground troubleshooting',
      'Daily check-ins',
    ],
    deliverables: [
      'All Planning Hub deliverables',
      'Dedicated WhatsApp concierge line',
      'Airport pickup coordination',
      'Daily itinerary management',
      'Real-time support during visit',
      'Post-visit summary report',
    ],
    idealFor: [
      'Diaspora returns',
      'First-time visitors',
      'Business travelers',
      'Family visits',
    ],
    icon: '🧭',
    popular: true,
    estimatedDelivery: '5-7 business days',
  },
  {
    id: 'full-memory',
    name: 'Full Memory',
    tagline: 'Complete Experience Package',
    description: 'The ultimate Rwanda experience. Everything managed, every moment captured, every memory preserved.',
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
    deliverables: [
      'All Onsite Manager deliverables',
      'Professional photo session (50+ edited photos)',
      'Video highlights reel (3-5 minutes)',
      'Digital photo album with captions',
      'Printed memory book (optional add-on)',
      'Post-visit impact report',
      'Cloud storage of all media',
    ],
    idealFor: [
      'Special occasions',
      'Research documentation',
      'Heritage trips',
      'Premium experiences',
    ],
    icon: '📸',
    popular: false,
    estimatedDelivery: '7-10 business days',
  },
];

// ========================================
// 📊 ORDER STATUS CONFIGURATION
// ========================================
export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: '⏳',
    color: '#F59E0B',
    bgColor: 'bg-status-pending/10',
    textColor: 'text-status-pending',
    description: 'Your order has been received and is awaiting review',
  },
  in_progress: {
    label: 'In Progress',
    icon: '🔄',
    color: '#3B82F6',
    bgColor: 'bg-status-inProgress/10',
    textColor: 'text-status-inProgress',
    description: 'We are actively working on your request',
  },
  completed: {
    label: 'Completed',
    icon: '✅',
    color: '#10B981',
    bgColor: 'bg-status-completed/10',
    textColor: 'text-status-completed',
    description: 'Your order is complete and all deliverables are ready',
  },
  cancelled: {
    label: 'Cancelled',
    icon: '❌',
    color: '#EF4444',
    bgColor: 'bg-status-cancelled/10',
    textColor: 'text-status-cancelled',
    description: 'This order has been cancelled',
  },
};

// ========================================
// 📱 CONTACT INFORMATION
// ========================================
export const CONTACT_INFO = {
  phone: '+250789765744', // Replace with actual
  whatsapp: '+250789765744', // Replace with actual
  email: 'ikazeconceirge@gmail.com',
  businessEmail: 'bookings@ikazeconcierge.com',
  supportEmail: 'support@ikazeconcierge.com',
  address: 'Kigali, Rwanda',
  businessHours: 'Mon-Fri: 8:00 AM - 6:00 PM EAT',
};

export const WHATSAPP_NUMBER = CONTACT_INFO.whatsapp.replace(/\D/g, '');

// ========================================
// 💬 TESTIMONIALS
// ========================================
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    role: 'Research Fellow, Stanford University',
    location: 'California, USA',
    text: 'Ikaze made my field research in Rwanda seamless. Every permit, every connection, every logistical detail—handled perfectly. I could focus entirely on my work.',
    avatar: '👩‍🔬',
    rating: 5,
    service: 'Onsite Manager',
    date: '2024-01',
  },
  {
    id: 2,
    name: 'James Mukendi',
    role: 'Diaspora Member',
    location: 'Brussels, Belgium',
    text: 'Coming home after 15 years felt overwhelming. Ikaze turned it into the most meaningful trip of my life. They understood exactly what I needed.',
    avatar: '👨‍💼',
    rating: 5,
    service: 'Full Memory',
    date: '2024-02',
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    role: 'NGO Director, Global Health Initiative',
    location: 'Madrid, Spain',
    text: 'Professional, responsive, and deeply knowledgeable. They anticipated needs I didn\'t even know I had. Absolute game-changer for our team.',
    avatar: '👩‍💻',
    rating: 5,
    service: 'Onsite Manager',
    date: '2023-11',
  },
  {
    id: 4,
    name: 'David Nsabimana',
    role: 'Tech Entrepreneur',
    location: 'Toronto, Canada',
    text: 'I needed to scout locations for a new venture. Ikaze connected me with the right people, handled all logistics, and made it incredibly efficient.',
    avatar: '👨‍💼',
    rating: 5,
    service: 'Planning Hub',
    date: '2024-03',
  },
  {
    id: 5,
    name: 'Aminata Diallo',
    role: 'Documentary Filmmaker',
    location: 'Paris, France',
    text: 'The Full Memory package exceeded expectations. The photos and videos they captured are now part of my film. True professionals.',
    avatar: '🎬',
    rating: 5,
    service: 'Full Memory',
    date: '2023-12',
  },
  {
    id: 6,
    name: 'Michael O\'Brien',
    role: 'Impact Investor',
    location: 'Dublin, Ireland',
    text: 'Ikaze understands the nuances of doing business in Rwanda. They saved me weeks of frustration. Highly recommend for any serious investor.',
    avatar: '💼',
    rating: 5,
    service: 'Onsite Manager',
    date: '2024-01',
  },
];

// ========================================
// ❓ FREQUENTLY ASKED QUESTIONS
// ========================================
export const FAQS = [
  {
    id: 1,
    category: 'General',
    question: 'What exactly is Ikaze Concierge?',
    answer: 'Ikaze Concierge is a premium trip planning and on-ground concierge service for Rwanda. We handle everything from pre-visit planning to on-ground support and post-visit memories, so you can focus on your experience.',
  },
  {
    id: 2,
    category: 'Services',
    question: 'Which service package is right for me?',
    answer: 'Planning Hub is great for independent travelers who want expert planning. Onsite Manager is perfect for first-time visitors or those wanting hands-on support. Full Memory is ideal for special occasions or when you want professional documentation.',
  },
  {
    id: 3,
    category: 'Booking',
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 2-3 weeks before your arrival for Planning Hub, and 4-6 weeks for Onsite Manager or Full Memory to ensure full availability and thorough preparation.',
  },
  {
    id: 4,
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, mobile money, and major credit cards. Payment details will be provided after your booking is confirmed.',
  },
  {
    id: 5,
    category: 'Services',
    question: 'Do you help with visa and permit applications?',
    answer: 'Yes! We provide guidance on Rwanda visa requirements and help with permit applications through Irembo (Rwanda\'s e-government platform). Note: We facilitate the process but government approval is subject to official review.',
  },
  {
    id: 6,
    category: 'General',
    question: 'Can I customize my service package?',
    answer: 'Absolutely! While our three tiers cover most needs, we can customize services based on your specific requirements. Contact us to discuss your unique needs.',
  },
  {
    id: 7,
    category: 'Support',
    question: 'What kind of support do I get during my visit?',
    answer: 'Onsite Manager and Full Memory packages include dedicated WhatsApp support, daily check-ins, and real-time troubleshooting throughout your stay.',
  },
  {
    id: 8,
    category: 'Cancellation',
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 14+ days before arrival receive a full refund. 7-13 days: 50% refund. Less than 7 days: no refund. Service-specific exceptions may apply.',
  },
];

// ========================================
// 🌍 TARGET AUDIENCES
// ========================================
export const TARGET_AUDIENCES = [
  {
    id: 'diaspora',
    name: 'Diaspora',
    icon: '🏡',
    description: 'Rwandans returning home from abroad',
    painPoints: [
      'Overwhelming planning after years away',
      'Lost connections and contacts',
      'Navigating changed systems (Irembo, etc.)',
      'Wanting meaningful family reconnection',
    ],
    howWeHelp: 'We bridge the gap between your memories and today\'s Rwanda, handling modern logistics while you focus on reconnection.',
  },
  {
    id: 'researchers',
    name: 'Researchers & Academics',
    icon: '📚',
    description: 'Field researchers, scholars, and students',
    painPoints: [
      'Complex permit requirements',
      'Finding reliable local contacts',
      'Time-consuming logistics',
      'Documentation needs',
    ],
    howWeHelp: 'We handle all administrative hurdles and provide local expertise so you can focus entirely on your research.',
  },
  {
    id: 'investors',
    name: 'Investors & Entrepreneurs',
    icon: '💼',
    description: 'Business professionals exploring opportunities',
    painPoints: [
      'Need for efficient site visits',
      'Meeting coordination',
      'Understanding local business culture',
      'Time-sensitive schedules',
    ],
    howWeHelp: 'We maximize your time with efficient scheduling, local insights, and seamless coordination.',
  },
  {
    id: 'ngos',
    name: 'NGOs & Organizations',
    icon: '🌱',
    description: 'International organizations and teams',
    painPoints: [
      'Group logistics',
      'Compliance and permits',
      'Local partnerships',
      'Impact documentation',
    ],
    howWeHelp: 'We manage all ground operations, compliance, and documentation so your team can focus on impact.',
  },
];

// ========================================
// 📍 RWANDA HIGHLIGHTS
// ========================================
export const RWANDA_HIGHLIGHTS = [
  {
    id: 'kigali',
    name: 'Kigali City',
    icon: '🏙️',
    description: 'East Africa\'s cleanest, safest capital',
  },
  {
    id: 'gorillas',
    name: 'Mountain Gorillas',
    icon: '🦍',
    description: 'Unforgettable gorilla trekking',
  },
  {
    id: 'lakes',
    name: 'Lake Kivu',
    icon: '🏞️',
    description: 'Stunning lakeside relaxation',
  },
  {
    id: 'culture',
    name: 'Rich Culture',
    icon: '🎭',
    description: 'Vibrant traditions and arts',
  },
];

// ========================================
// 🔧 APPLICATION SETTINGS
// ========================================
export const APP_CONFIG = {
  appName: 'Ikaze Concierge & Logistics',
  tagline: 'Professional Planner. Warmly Rwandan.',
  version: '1.0.0',
  apiTimeout: 30000, // 30 seconds
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'video/mp4', 'video/quicktime'],
  paginationLimit: 10,
  sessionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// ========================================
// 📝 FORM VALIDATION RULES
// ========================================
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Please enter a valid name',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: 'Please enter a valid phone number with country code',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must contain uppercase, lowercase, number and special character',
  },
};

// ========================================
// 🎯 BOOKING FLOW STEPS
// ========================================
export const BOOKING_STEPS = [
  {
    step: 1,
    name: 'Choose Service',
    description: 'Select the package that fits your needs',
    icon: '🛎️',
  },
  {
    step: 2,
    name: 'Your Details',
    description: 'Tell us about your visit',
    icon: '📝',
  },
  {
    step: 3,
    name: 'Confirm',
    description: 'Review and submit your booking',
    icon: '✅',
  },
];

// ========================================
// 🏆 TRUST INDICATORS
// ========================================
export const TRUST_INDICATORS = [
  {
    id: 'clients',
    value: '50+',
    label: 'Happy Clients',
    icon: '👥',
  },
  {
    id: 'success',
    value: '100%',
    label: 'Success Rate',
    icon: '✅',
  },
  {
    id: 'countries',
    value: '15+',
    label: 'Countries Served',
    icon: '🌍',
  },
  {
    id: 'rating',
    value: '5.0',
    label: 'Client Rating',
    icon: '⭐',
  },
];

// ========================================
// 🔗 SOCIAL MEDIA LINKS
// ========================================
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/ikazeconcierge',
  twitter: 'https://twitter.com/ikazeconcierge',
  instagram: 'https://instagram.com/ikazeconcierge',
  linkedin: 'https://linkedin.com/company/ikazeconcierge',
  youtube: 'https://youtube.com/@ikazeconcierge',
};

// ========================================
// 📅 BUSINESS INFORMATION
// ========================================
export const BUSINESS_INFO = {
  legalName: 'Ikaze Concierge & Logistics Ltd.',
  registrationNumber: 'RW-XXX-XXXX', // Replace with actual
  taxId: 'TIN-XXXXXXXXX', // Replace with actual
  foundedYear: 2023,
  industry: 'Concierge & Travel Services',
  headquarters: 'Kigali, Rwanda',
};

// Export all as default for convenience
export default {
  COLORS,
  SERVICES,
  ORDER_STATUS,
  STATUS_CONFIG,
  CONTACT_INFO,
  WHATSAPP_NUMBER,
  TESTIMONIALS,
  FAQS,
  TARGET_AUDIENCES,
  RWANDA_HIGHLIGHTS,
  APP_CONFIG,
  VALIDATION_RULES,
  BOOKING_STEPS,
  TRUST_INDICATORS,
  SOCIAL_LINKS,
  BUSINESS_INFO,
};