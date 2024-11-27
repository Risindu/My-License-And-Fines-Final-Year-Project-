const express = require('express');
const dotenv = require('dotenv');
const db = require('./models/db');
const cors = require('cors');
dotenv.config();

const app = express();

// Enable CORS for all origins
// Enable CORS for all origins
app.use(cors()); // Allows all origins

// Alternatively, you can specify options without the 'origin' property
app.use(cors({
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware
app.use(express.json());

// Import Routes
const authRoute = require('./routes/auth');
const finesRoute = require('./routes/fines');
const editProfileRoute = require('./routes/editProfile');
const paymentRoute = require('./routes/payment');




// Route Middleware
app.use('/api/auth', authRoute);
app.use('/api/fines', finesRoute);
app.use('/api/editProfile', editProfileRoute);
app.use('/api/payment', paymentRoute);




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
