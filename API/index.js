const express = require('express');
const dotenv = require('dotenv');
const db = require('./models/db');
const cors = require('cors');
dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: 'http://localhost:3000', // Update with your frontend origin
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));


// Middleware
app.use(express.json());

// Import Routes
const authRoute = require('./routes/auth');

// Route Middleware
app.use('/api/auth', authRoute);

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT 1');
        res.send('Database connection works');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection failed');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
