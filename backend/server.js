const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Load environment variables BEFORE importing other modules that might use them
dotenv.config();

const studentRoutes = require('./routes/students');
const intakeRoutes = require('./routes/intake');
const boardRoutes = require('./routes/board');
const offerRoutes = require('./routes/offers');
const taskRoutes = require('./routes/tasks');
const gamificationRoutes = require('./routes/gamification'); // [NEW]
const authRoutes = require('./routes/authRoutes');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reports', require('./routes/reports')); // [NEW]

// Database Connection Check
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
