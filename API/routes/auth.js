const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Ensure the correct path to db.js
const router = express.Router();
const crypto = require('crypto');
const authenticateToken = require('../middleware/authenticateToken');
// const nodemailer = require('nodemailer');

// Setup nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });


// Driver Login Route
router.post('/driver/login', async (req, res) => {
    const { email, password, api_key } = req.body;

    try {
        if(api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        const [rows] = await db.execute('SELECT * FROM driver WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).send('Invalid email or password.');

        const user = rows[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');

        // Set token to expire in 15 minutes
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.send({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

// Division Login Route
router.post('/division/login', async (req, res) => {
    const { email, password, api_key } = req.body;

    try {
        if(api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        const [rows] = await db.execute('SELECT * FROM police_division WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).send('Invalid division email.');

        const division = rows[0];

        const validPassword = await bcrypt.compare(password, division.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');

        // Set token to expire in 15 minutes
        const token = jwt.sign({ id: division.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.send({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});



// Driver Signup Route
// router.post('/driver/signup', async (req, res) => {
//     const { token_id, division_id, username, email, password, profile_picture, qr_code, birthday, api_key } = req.body;

//     try {
//         if(api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

//         const [rows] = await db.execute('SELECT * FROM driver WHERE email = ?', [email]);
//         if (rows.length > 0) return res.status(400).send('Driver already registered.');

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         await db.execute('INSERT INTO driver (token_id, division_id, username, email, password, profile_picture, qr_code, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [token_id, division_id, username, email, hashedPassword, profile_picture, qr_code, birthday]);
//         res.send('Driver registered successfully.');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error.');
//     }
// });



// Division Signup Route
router.post('/division/signup', async (req, res) => {
    const { division_id, division_name, email, location, password, api_key } = req.body;

    try {
        if(api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        const [rows] = await db.execute('SELECT * FROM police_division WHERE division_id = ?', [division_id]);
        if (rows.length > 0) return res.status(400).send('Police division already registered.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.execute('INSERT INTO police_division (division_id, division_name, email, location, password) VALUES (?, ?, ?, ?, ?)', [division_id, division_name, email, location, hashedPassword]);
        res.send('Police division registered successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});



// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM driver WHERE email = ? UNION SELECT * FROM police_division WHERE email = ?', [email, email]);
        if (rows.length === 0) return res.status(400).send('Email not found.');

        const user = rows[0];
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        await db.execute('UPDATE driver SET reset_token = ?, reset_token_expires = ? WHERE email = ? UNION UPDATE police_division SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [resetToken, resetTokenExpires, email, resetToken, resetTokenExpires, email]);

        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste it into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.send('Password reset link sent to your email.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, resetToken } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM driver WHERE email = ? AND reset_token = ? AND reset_token_expires > ? UNION SELECT * FROM police_division WHERE email = ? AND reset_token = ? AND reset_token_expires > ?', [email, resetToken, Date.now(), email, resetToken, Date.now()]);
        if (rows.length === 0) return res.status(400).send('Invalid or expired reset token.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.execute('UPDATE driver SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ? UNION UPDATE police_division SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?', [hashedPassword, email, hashedPassword, email]);

        res.send('Password reset successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});


// Token Verification Route
router.post('/verify-token', (req, res) => {
    const { token } = req.body;

    if (!token) return res.sendStatus(401); // Unauthorized if no token is provided

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid or expired
        res.sendStatus(200); // OK if token is valid
    });
});

// Sample Protected Route
router.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route.');
});


module.exports = router;
