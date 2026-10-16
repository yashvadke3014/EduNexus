const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Hackathon = require('../models/Hackathon');
const Internship = require('../models/Internship');
const Event = require('../models/Event');
const Course = require('../models/Course');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edunexus';

const hackathons = [
  {
    title: 'Smart India Hackathon 2024',
    description: 'India\'s biggest hackathon organized by the Government of India. Solve real-world problems.',
    organizer: 'Government of India',
    branches: ['CSE', 'IT', 'ECE', 'AIDS', 'AIML'],
    registrationFee: 0,
    prizePool: '₹1,00,000',
    mode: 'Offline',
    status: 'Upcoming',
    tags: ['AI', 'ML', 'IoT', 'Sustainability'],
    registrationDeadline: new Date('2024-11-30'),
    startDate: new Date('2024-12-15'),
  },
  {
    title: 'DevHack 2024 — MERN Stack',
    description: 'Build full-stack web applications using MERN stack. Open to all CSE and IT students.',
    organizer: 'HackClub India',
    branches: ['CSE', 'IT'],
    registrationFee: 199,
    prizePool: '₹50,000',
    mode: 'Online',
    status: 'Upcoming',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    registrationDeadline: new Date('2024-11-10'),
    startDate: new Date('2024-11-20'),
  },
  {
    title: 'CircuitBreaker — Electronics Challenge',
    description: 'Design and build embedded systems. For ECE and EE branch students.',
    organizer: 'IEEE Student Branch',
    branches: ['ECE', 'EE'],
    registrationFee: 100,
    prizePool: '₹30,000',
    mode: 'Offline',
    status: 'Upcoming',
    tags: ['IoT', 'Embedded', 'Arduino', 'RTOS'],
    registrationDeadline: new Date('2024-11-30'),
  },
  {
    title: 'HackFinance — Fintech Edition',
    description: 'Build innovative fintech solutions. Open to all branches.',
    organizer: 'Razorpay Campus',
    branches: ['All'],
    registrationFee: 0,
    prizePool: '₹75,000 + Internship',
    mode: 'Hybrid',
    status: 'Completed',
    tags: ['Fintech', 'Blockchain', 'Payments'],
    winners: [
      { position: 1, teamName: 'PayVault', members: ['Rahul', 'Priya'], prize: '₹30,000 + Internship' },
      { position: 2, teamName: 'CoinBridge', members: ['Amit', 'Sneha'], prize: '₹20,000' },
      { position: 3, teamName: 'EasyPay', members: ['Vikram'], prize: '₹10,000' },
    ],
  },
];

const internships = [
  {
    title: 'Software Developer Intern',
    company: 'Google',
    description: 'Work on Google\'s core infrastructure and services. Competitive stipend.',
    branches: ['CSE', 'IT', 'AIDS'],
    skills: ['Python', 'Java', 'Cloud', 'System Design'],
    duration: '3 months',
    stipend: '₹80,000/month',
    mode: 'Hybrid',
    location: 'Bangalore',
    applicationDeadline: new Date('2024-12-01'),
    status: 'Open',
  },
  {
    title: 'ML Research Intern',
    company: 'Microsoft Research',
    description: 'Work on cutting-edge ML research projects with Microsoft researchers.',
    branches: ['CSE', 'AIDS', 'AIML'],
    skills: ['Python', 'TensorFlow', 'NLP', 'PyTorch'],
    duration: '6 months',
    stipend: '₹60,000/month',
    mode: 'On-site',
    location: 'Bangalore',
    applicationDeadline: new Date('2024-11-20'),
    status: 'Open',
  },
  {
    title: 'Embedded Systems Intern',
    company: 'Qualcomm',
    description: 'Work on embedded firmware for next-gen mobile chipsets.',
    branches: ['ECE', 'EE'],
    skills: ['C', 'ARM', 'RTOS', 'Embedded Linux'],
    duration: '4 months',
    stipend: '₹50,000/month',
    mode: 'On-site',
    location: 'Hyderabad',
    applicationDeadline: new Date('2024-12-15'),
    status: 'Open',
  },
  {
    title: 'Civil Engineering Intern',
    company: 'L&T Construction',
    description: 'Site supervision and structural design internship.',
    branches: ['CE', 'ME'],
    skills: ['AutoCAD', 'STAAD Pro', 'Surveying'],
    duration: '2 months',
    stipend: '₹20,000/month',
    mode: 'On-site',
    location: 'Mumbai',
    applicationDeadline: new Date('2024-12-10'),
    status: 'Open',
  },
];

const events = [
  {
    title: 'AI & ML Workshop — Hands On',
    description: 'Hands-on workshop covering machine learning fundamentals with Python.',
    category: 'Workshop',
    organizer: 'TechClub SVIT',
    branches: ['CSE', 'IT', 'AIDS', 'AIML'],
    date: new Date('2024-11-25'),
    time: '10:00 AM',
    venue: 'Seminar Hall 1',
    mode: 'Offline',
    registrationFee: 0,
    status: 'Upcoming',
    tags: ['AI', 'ML', 'Python'],
  },
  {
    title: 'Web3 & Blockchain Seminar',
    description: 'Introduction to Web3 technologies and blockchain development.',
    category: 'Seminar',
    organizer: 'Developer Student Club',
    branches: ['All'],
    date: new Date('2024-11-30'),
    time: '2:00 PM',
    venue: 'Google Meet',
    mode: 'Online',
    registrationFee: 0,
    status: 'Upcoming',
    tags: ['Blockchain', 'Web3', 'Crypto'],
  },
];

const courses = [
  {
    title: 'Full Stack Web Development Bootcamp',
    description: 'Complete MERN stack bootcamp from beginner to deployment.',
    instructor: 'Hitesh Choudhary',
    branches: ['CSE', 'IT', 'AIDS'],
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    price: 1999,
    duration: '8 weeks',
    level: 'Intermediate',
    tags: ['MERN', 'Web', 'Full Stack'],
    totalEnrolled: 12400,
    rating: 4.8,
    modules: [
      { title: 'HTML & CSS Basics', description: 'Foundation of web', duration: '3 hours' },
      { title: 'JavaScript ES6+', description: 'Modern JS features', duration: '5 hours' },
      { title: 'React Fundamentals', description: 'Components and hooks', duration: '8 hours' },
    ],
  },
  {
    title: 'Machine Learning from Scratch',
    description: 'Learn ML algorithms from basics to advanced neural networks.',
    instructor: 'NPTEL — IIT Madras',
    branches: ['CSE', 'AIDS', 'DS', 'AIML'],
    skills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow'],
    price: 0,
    duration: '10 weeks',
    level: 'Beginner',
    tags: ['ML', 'AI', 'Python', 'Data Science'],
    totalEnrolled: 45200,
    rating: 4.9,
  },
  {
    title: 'Embedded Systems & RTOS',
    description: 'Comprehensive guide to embedded systems programming and real-time OS.',
    instructor: 'Prof. K. Srinivas',
    branches: ['ECE', 'EE'],
    skills: ['C', 'ARM', 'RTOS', 'FreeRTOS', 'STM32'],
    price: 1499,
    duration: '6 weeks',
    level: 'Intermediate',
    tags: ['Embedded', 'IoT', 'RTOS', 'Microcontroller'],
    totalEnrolled: 3200,
    rating: 4.6,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected. Seeding...');

    await Hackathon.deleteMany({});
    await Internship.deleteMany({});
    await Event.deleteMany({});
    await Course.deleteMany({});

    await Hackathon.insertMany(hackathons);
    await Internship.insertMany(internships);
    await Event.insertMany(events);
    await Course.insertMany(courses);

    console.log('✅ Database seeded successfully!');
    console.log(`   Hackathons: ${hackathons.length}`);
    console.log(`   Internships: ${internships.length}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   Courses: ${courses.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
