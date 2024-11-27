const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models/db'); // Ensure the correct path to db.js
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Route to update the division profile
router.post('/division/update-profile', async (req, res) => {
    const { division_id, division_name, email, location, phone_number, password, api_key } = req.body;

    try {
        // Validate API key
        if(api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        // Fetch division data using the provided division_id to make sure the division exists
        const [divisionRows] = await db.execute('SELECT * FROM police_division WHERE division_id = ?', [division_id]);

        // If the division does not exist, return an error
        if (divisionRows.length === 0) return res.status(404).send('Division not found.');

        const division = divisionRows[0];

        // Hash the new password if provided
        let updatedPassword = division.password; // Keep the existing password if not updating
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedPassword = await bcrypt.hash(password, salt);
        }

        // Update the division information in the database
        await db.execute(`
            UPDATE police_division 
            SET division_name = ?, email = ?, location = ?, phone_number = ?, password = ? 
            WHERE division_id = ?
        `, [division_name, email, location, phone_number, updatedPassword, division_id]);

        // Send a success response
        res.send('Division profile updated successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

// Driver Update Profile Route
router.post('/driver/update-profile', async (req, res) => {
    const { driver_id, username, email, password, mobile_number, api_key } = req.body;

    try {
        // Validate API key
        if (api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        // Step 1: Fetch the driver by driver_id to ensure they exist
        const [driverRows] = await db.execute(`
            SELECT * FROM driver WHERE driver_id = ?
        `, [driver_id]);

        if (driverRows.length === 0) {
            return res.status(404).send('Driver not found.');
        }

        const driver = driverRows[0];

        // Step 2: Hash the new password if it's being updated
        let updatedPassword = driver.password; // Keep the current password if it's not being updated
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedPassword = await bcrypt.hash(password, salt);
        }

        // Step 3: Update the driver information in the database
        await db.execute(`
            UPDATE driver 
            SET username = ?, email = ?, password = ?, mobile_number = ?
            WHERE driver_id = ?
        `, [username, email, updatedPassword, mobile_number, driver_id]);

        // Step 4: Return success message
        res.send('Update success');
    } catch (err) {
        console.error('Error details:', err);
        res.status(500).send('Update failed.');
    }
});



module.exports = router;
