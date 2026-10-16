const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/hackathons', require('./routes/hackathons'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/news', require('./routes/news'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/chatbot', require('./routes/chatbot'));

app.get('/', (req, res) => res.json({ message: 'EduNexus API Running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
