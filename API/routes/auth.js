const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Ensure the correct path to db.js
const db_license = require('../models/db_license'); // Ensure the correct path to db_license.js
const router = express.Router();
const crypto = require('crypto');
const qr = require('qrcode'); // For generating QR codes
const fs = require('fs'); // For file system operations
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2; // Cloudinary SDK
const authenticateToken = require('../middleware/authenticateToken');

router.post('/driver/login', async (req, res) => {
    const { email, password, api_key } = req.body;

    try {
        if (api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        const [rows] = await db.execute('SELECT * FROM driver WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).send('Invalid email or password.');

        const user = rows[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');

        const [notifications] = await db.execute(`
            SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC
        `, [user.driver_id]);

        const token = jwt.sign({ id: user.driver_id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.send({
            token,
            driver_id: user.driver_id,
            username: user.username,
            email: user.email,
            qr_code: user.qr_code,
            profile_picture: user.profile_picture,
            notifications
        });
    } catch (err) {
        console.error('Error details:', err);
        res.status(500).send('Server error.');
    }
});

// Forgot Password Route for Drivers
router.post('/driver/forgot-password', async (req, res) => {
    const { email, api_key } = req.body;

    try {
        // Validate the API key
        if (api_key !== process.env.API_KEY) {
            return res.status(400).send('Invalid API key.');
        }

        // Check if the email exists in the driver table
        const [rows] = await db.execute('SELECT * FROM driver WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).send('User with this email does not exist.');
        }

        // Generate a random OTP (6 digits)
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store OTP and its expiration time in the database (e.g., 10 minutes)
        const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await db.execute(
            'UPDATE driver SET otp = ?, otp_expiration = ? WHERE email = ?',
            [otp, expirationTime, email]
        );

        // Configure nodemailer to send the OTP email
        const transporter = nodemailer.createTransport({
            
            service: 'gmail', // Replace with your email service provider
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app-specific password
            },
        });

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Failed to send OTP email.');
            }
            res.send('OTP sent successfully.');
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server error.');
    }
});

// Verify OTP Route for Drivers
router.post('/driver/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Retrieve user by email
        const [rows] = await db.execute('SELECT * FROM driver WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).send('User not found.');

        const user = rows[0];

        // Check if OTP matches and is not expired
        if (user.otp !== otp) return res.status(400).send('Invalid OTP.');
        if (user.otp_expiration < Date.now()) return res.status(400).send('OTP has expired.');

        // Clear the OTP and expiration once verified
        await db.execute('UPDATE driver SET otp = NULL, otp_expiration = NULL WHERE email = ?', [email]);

        // Generate JWT token
        const token = jwt.sign({ id: user.driver_id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.send({
            message: 'OTP verified successfully. Login successful.',
            token,
            driver_id: user.driver_id,
            username: user.username,
            email: user.email,
            qr_code: user.qr_code,
            profile_picture: user.profile_picture
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server error.');
    }
});

router.post('/division/login', async (req, res) => {
    const { email, password, api_key } = req.body;

    try {
        if (api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        const [divisionRows] = await db.execute('SELECT * FROM police_division WHERE email = ?', [email]);
        if (divisionRows.length === 0) return res.status(400).send('Invalid division email.');
        const division = divisionRows[0];

        const validPassword = await bcrypt.compare(password, division.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');

        const token = jwt.sign({ id: division.division_id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const [fineRows] = await db.execute(`
            SELECT 
                COUNT(*) AS total_fines,
                SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_fines,
                SUM(CASE WHEN status = 'not paid' THEN 1 ELSE 0 END) AS remaining_fines,
                COUNT(CASE WHEN date >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) THEN 1 END) AS last_two_month_fines,
                COUNT(CASE WHEN YEAR(date) = YEAR(CURDATE()) THEN 1 END) AS this_year_fines
            FROM fines
            WHERE division_id = ?
        `, [division.division_id]);

        const [locationRows] = await db.execute(`
            SELECT lat, lon
            FROM fines
            WHERE division_id = ? 
            AND MONTH(date) = MONTH(CURDATE()) 
            AND YEAR(date) = YEAR(CURDATE())
        `, [division.division_id]);

        const response = {
            token_id: token,
            division_name: division.division_name,
            issued_fines: fineRows[0].total_fines,
            paid_fines: fineRows[0].paid_fines,
            remaining_fines: fineRows[0].remaining_fines,
            last_two_month_fines: fineRows[0].last_two_month_fines,
            this_year_fines: fineRows[0].this_year_fines,
            this_month_violation_hotspots: locationRows.map(loc => ({ lat: loc.lat, lon: loc.lon }))
        };

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

router.post('/driver/signup', async (req, res) => {
    const { license_number, nic_number, username, email, password, division_name, api_key } = req.body;

    try {
        if (api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        const [licenseRows] = await db_license.execute(`SELECT * FROM information WHERE license_number = ? AND nic = ?`, [license_number, nic_number]);
        if (licenseRows.length === 0) return res.status(404).send('License number and NIC do not match.');

        const licenseData = licenseRows[0];

        const [existingDriver] = await db.execute(`SELECT * FROM driver WHERE license_number = ? OR nic_number = ?`, [license_number, nic_number]);
        if (existingDriver.length > 0) return res.status(400).send('Driver already registered.');

        const [divisionRows] = await db.execute(`SELECT division_id FROM police_division WHERE division_name = ?`, [division_name]);
        if (divisionRows.length === 0) return res.status(404).send('Division not found.');
        const division_id = divisionRows[0].division_id;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the driver and get driver_id
        const [driverResult] = await db.execute(`
            INSERT INTO driver 
            (license_number, nic_number, division_id, surname, firstname, middle_name, last_name, date_of_birth, date_of_issue, date_of_expiry, permanent_residence_address, email, mobile_number, username, password, profile_picture)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            licenseData.license_number,
            licenseData.nic,
            division_id,
            licenseData.surname,
            licenseData.first_name,
            licenseData.middle_name || null,
            licenseData.last_name || null,
            licenseData.date_of_birth,
            licenseData.date_of_issue,
            licenseData.date_of_expiry,
            licenseData.permanent_residence_address || null,
            email,
            licenseData.mobile_number,
            username,
            hashedPassword,
            licenseData.profile_picture
        ]);

        const driver_id = driverResult.insertId;

        // Generate QR code data with driver_id
        const qrCodeData = `${driver_id}`;
        const qrCodeBuffer = await qr.toBuffer(qrCodeData);

        // Upload QR code to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(`data:image/png;base64,${qrCodeBuffer.toString('base64')}`, {
            folder: 'driver_qr_codes'
        });

        // Update driver record with the QR code path
        await db.execute(`UPDATE driver SET qr_code = ? WHERE driver_id = ?`, [cloudinaryResponse.secure_url, driver_id]);

        // Add vehicles for the driver
        const [vehicleRows] = await db_license.execute(`SELECT * FROM vehicles_information WHERE license_number = ?`, [license_number]);
        for (const vehicle of vehicleRows) {
            if (vehicle.vehicle_category && vehicle.date_of_issue && vehicle.date_of_expiry) {
                await db.execute(`
                    INSERT INTO driver_vehicles (driver_id, vehicle_category, vehicle_issue_date, vehicle_expiry_date)
                    VALUES (?, ?, ?, ?)
                `, [driver_id, vehicle.vehicle_category, vehicle.date_of_issue, vehicle.date_of_expiry]);
            }
        }

        res.send('Driver registered successfully with QR code.');
    } catch (err) {
        console.error('Error details:', err);
        res.status(500).send('Server error.');
    }
});

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


//Officer Routes

// Officer Signup Route
router.post('/officer/signup', async (req, res) => {
    const { division_id, username, password, badge_no, surname, first_name, middle_name, last_name, api_key } = req.body;

    try {
        if (api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        // Check if officer is already registered
        const [existingOfficer] = await db.execute('SELECT * FROM officer WHERE badge_no = ?', [badge_no]);
        if (existingOfficer.length > 0) return res.status(400).send('Officer already registered.');

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert officer into the database
        await db.execute(`
            INSERT INTO officer (division_id, username, password, badge_no, surname, first_name, middle_name, last_name) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [division_id, username, hashedPassword, badge_no, surname, first_name, middle_name, last_name]);

        res.send('Officer registered successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

// Officer Login Route
router.post('/officer/login', async (req, res) => {
    const { username, password, api_key } = req.body;

    try {
        if (api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        // Check if officer exists
        const [officerRows] = await db.execute('SELECT * FROM officer WHERE username = ?', [username]);
        if (officerRows.length === 0) return res.status(400).send('Invalid username or password.');

        const officer = officerRows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, officer.password);
        if (!validPassword) return res.status(400).send('Invalid username or password.');

        // Generate token
        const token = jwt.sign({ id: officer.officer_id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.send({
            token,
            officer_id: officer.officer_id,
            division_id: officer.division_id,
            username: officer.username,
            profile_picture: officer.profile_picture,
            badge_no: officer.badge_no
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});


// Officer Landing Page Data Route
router.get('/officer/landing/:officer_id', async (req, res) => {
    const { officer_id } = req.params;

    try {
        // Fetching statistics for total fines, today's fines, and pending cases (where status is 'not paid')
        const [stats] = await db.execute(
            `SELECT 
                COUNT(*) AS total_fines,
                SUM(CASE WHEN DATE(date) = CURDATE() THEN 1 ELSE 0 END) AS fines_today,
                SUM(CASE WHEN status = 'not paid' THEN 1 ELSE 0 END) AS pending_cases
             FROM fines WHERE officer_id = ?`,
            [officer_id]
        );

        // Fetching recent activity for the officer
        const [activity] = await db.execute(
            `SELECT fine_id, description, date 
             FROM fines 
             WHERE officer_id = ? 
             ORDER BY date DESC 
             LIMIT 3`,
            [officer_id]
        );

        // Sending response with all necessary data
        res.json({
            total_fines: stats[0].total_fines,
            fines_today: stats[0].fines_today,
            pending_cases: stats[0].pending_cases,
            recent_activity: activity,
        });
    } catch (error) {
        console.error("Error retrieving officer landing data:", error);
        res.status(500).send("Server error.");
    }
});



// Process QR code and retrieve driver information, fines, and license status
router.post('/officer/process-qr', async (req, res) => {
    const { qr_data } = req.body;

    try {
        // Log received QR data to verify its contents
        console.log("QR Data received:", qr_data);

        // Assuming QR data contains the driver ID
        const driverId = qr_data; // Use parsing if needed

        // Fetch driver information, including license status
        const [driverInfo] = await db.execute(
            `SELECT driver_id, username, email, profile_picture, license_status, 
                    license_number, nic_number, surname, firstname, middle_name, last_name, 
                    date_of_birth, date_of_issue, date_of_expiry, permanent_residence_address
             FROM driver 
             WHERE driver_id = ?`, 
            [driverId]
        );

        // Check if driver was found
        if (driverInfo.length === 0) {
            console.log("Driver not found with driver_id:", driverId); // Log if not found
            return res.status(404).send({ message: 'Driver not found.' });
        }

        // Log driver information for debugging
        console.log("Driver info retrieved:", driverInfo[0]);

        // Fetch fines for the driver
        const [fines] = await db.execute(
            `SELECT fine_id, amount, description, category, status, date 
             FROM fines 
             WHERE driver_id = ?`, 
            [driverId]
        );

        // Respond with driver information and fines
        res.json({
            driver_info: driverInfo[0],
            fines: fines
        });
    } catch (error) {
        console.error("Error processing QR code:", error);
        res.status(500).send({ message: 'Server error processing QR data.' });
    }
});

// Issue Fine Route
router.post('/officer/issue-fine', async (req, res) => {
    const { driver_id, officer_id, category, amount, description, latitude, longitude } = req.body;

    try {
        // Check if all required fields are provided
        if (!driver_id || !officer_id || !category || !amount || !latitude || !longitude) {
            return res.status(400).json({ message: 'Please provide all required fields including latitude and longitude.' });
        }

        // Retrieve division_id from the driver table using driver_id
        const [divisionResult] = await db.execute(
            `SELECT division_id FROM driver WHERE driver_id = ?`,
            [driver_id]
        );

        if (divisionResult.length === 0) {
            return res.status(404).json({ message: 'Driver not found.' });
        }

        const division_id = divisionResult[0].division_id;

        // Insert the fine into the fines table with division_id, latitude, and longitude
        const [result] = await db.execute(
            `INSERT INTO fines (driver_id, officer_id, division_id, category, amount, description, status, date, lat, lon)
             VALUES (?, ?, ?, ?, ?, ?, 'not paid', NOW(), ?, ?)`,
            [driver_id, officer_id, division_id, category, amount, description, latitude, longitude]
        );

        // Check if the fine was successfully inserted
        if (result.affectedRows === 1) {
            // Update the driver's license status to 'revoked'
            await db.execute(
                `UPDATE driver SET license_status = 'revoked' WHERE driver_id = ?`,
                [driver_id]
            );

            res.status(200).json({ message: 'Fine issued successfully, license status set to revoked.' });
        } else {
            res.status(500).json({ message: 'Failed to issue fine. Please try again.' });
        }
    } catch (error) {
        console.error('Error issuing fine:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


router.get('/officer/:officer_id/issued-fines', async (req, res) => {
    const { officer_id } = req.params;

    try {
        const [rows] = await db.execute(
            `SELECT fine_id, date, amount, category, status, description, lat, lon 
             FROM fines
             WHERE officer_id = ?
             AND MONTH(date) = MONTH(CURRENT_DATE())
             AND YEAR(date) = YEAR(CURRENT_DATE())
             ORDER BY date DESC`,
            [officer_id]
        );

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'No issued fines found for this officer in the current month.' });
        }
    } catch (error) {
        console.error('Error fetching issued fines:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


// Route to update officer username and password
router.put('/officer/update-credentials', async (req, res) => {
    const { officer_id, username, password } = req.body;

    try {
        // Validate required fields
        if (!officer_id || !username || !password) {
            return res.status(400).json({ message: 'Officer ID, username, and password are required.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the officer’s username and password in the database
        const [result] = await db.execute(
            `UPDATE officer SET username = ?, password = ? WHERE officer_id = ?`,
            [username, hashedPassword, officer_id]
        );

        if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Credentials updated successfully.' });
        } else {
            res.status(404).json({ message: 'Officer not found.' });
        }
    } catch (error) {
        console.error('Error updating officer credentials:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


router.post('/verify-token', (req, res) => {
    const { token } = req.body;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.sendStatus(403);
        res.sendStatus(200);
    });
});

router.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route.');
});




module.exports = router;
