# EduNexus — University Event Aggregator Platform

## Setup Instructions

### Step 1 — Install Prerequisites
- Node.js v18+ → nodejs.org
- MongoDB → mongodb.com/try/download/community
- VS Code → code.visualstudio.com

### Step 2 — Backend Setup
```bash
cd edunexus/backend
npm install
cp .env.example .env
# Edit .env — add your MongoDB URI and Razorpay keys
npm run dev
```

### Step 3 — Seed the Database
```bash
cd edunexus/backend
node scripts/seed.js
```

### Step 4 — Frontend Setup
```bash
cd edunexus/frontend
npm install
npm start
```

Open http://localhost:3000 in your browser.

---

## Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/edunexus
JWT_SECRET=your_secret_here
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
```

## Project Structure
```
edunexus/
├── backend/          ← Node.js + Express API
├── frontend/         ← React app
└── research_notes/   ← ML evaluation docs
```
