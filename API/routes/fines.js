const express = require('express');
const db = require('../models/db'); // Ensure the correct path to db.js
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Route to get driver fines history based on driver ID
router.post('/driver/fines-history',authenticateToken, async (req, res) => {
    const { driver_id, api_key } = req.body;

    try {
        // Validate API key
        if(api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        // Fetch driver details
        const [driverRows] = await db.execute(`
            SELECT driver_id, username AS full_name, license_number AS license_id, nic_number AS national_id 
            FROM driver 
            WHERE driver_id = ?
        `, [driver_id]);

        // Check if driver exists
        if (driverRows.length === 0) return res.status(404).send('Driver not found.');

        // Fetch fines history for the driver
        const [finesRows] = await db.execute(`
            SELECT fine_id, description AS offence_issue, amount, 
                   DATE_FORMAT(date, '%Y-%m-%d') AS date_issue, 
                   DATE_FORMAT(DATE_ADD(date, INTERVAL 14 DAY), '%Y-%m-%d') AS date_expire 
            FROM fines 
            WHERE driver_id = ?
        `, [driver_id]);

        // Check if there are fines associated with the driver
        if (finesRows.length === 0) return res.status(404).send('No fines found for this driver.');

        // Prepare the response structure
        const response = {
            driver_id: driverRows[0].driver_id,
            full_name: driverRows[0].full_name,
            license_id: driverRows[0].license_id,
            national_id: driverRows[0].national_id,
            fines: finesRows.map(fine => ({
                offence_issue: fine.offence_issue,
                amount: fine.amount,
                date_issue: fine.date_issue,
                date_expire: fine.date_expire,
            })),
        };

        // Send the response as JSON
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

// Route to get driver fines history based on driver ID (only paid fines)
router.post('/driver/paid-fines-history', authenticateToken, async (req, res) => {
    const { driver_id, api_key } = req.body;

    try {
        // Validate API key
        if(api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        // Fetch driver details
        const [driverRows] = await db.execute(`
            SELECT driver_id, username AS full_name, license_number AS license_id, nic_number AS national_id 
            FROM driver 
            WHERE driver_id = ?
        `, [driver_id]);

        // Check if driver exists
        if (driverRows.length === 0) return res.status(404).send('Driver not found.');

        // Fetch only paid fines for the driver
        const [finesRows] = await db.execute(`
            SELECT fine_id, description AS offence_issue, amount, 
                   DATE_FORMAT(date, '%Y-%m-%d') AS date_issue, 
                   DATE_FORMAT(DATE_ADD(date, INTERVAL 14 DAY), '%Y-%m-%d') AS date_expire 
            FROM fines 
            WHERE driver_id = ? AND status = 'Paid'
        `, [driver_id]);

        // Check if there are paid fines associated with the driver
        if (finesRows.length === 0) return res.status(404).send('No paid fines found for this driver.');

        // Prepare the response structure
        const response = {
            driver_id: driverRows[0].driver_id,
            full_name: driverRows[0].full_name,
            license_id: driverRows[0].license_id,
            national_id: driverRows[0].national_id,
            fines: finesRows.map(fine => ({
                offence_issue: fine.offence_issue,
                amount: fine.amount,
                date_issue: fine.date_issue,
                date_expire: fine.date_expire,
            })),
        };

        // Send the response as JSON
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});


// Route to get all unpaid fines for a driver
router.post('/driver/unpaid-fines-history', authenticateToken, async (req, res) => {
    const { driver_id, api_key } = req.body;

    try {
        // Validate API key
        if(api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        // Fetch driver details
        const [driverRows] = await db.execute(`
            SELECT driver_id, username AS full_name, license_number AS license_id, nic_number AS national_id 
            FROM driver 
            WHERE driver_id = ?
        `, [driver_id]);

        // Check if driver exists
        if (driverRows.length === 0) return res.status(404).send('Driver not found.');

        // Fetch unpaid fines for the driver (assuming status='Unpaid')
        const [finesRows] = await db.execute(`
            SELECT fine_id, description AS offence_issue, amount, 
                   DATE_FORMAT(date, '%Y-%m-%d') AS date_issue, 
                   DATE_FORMAT(DATE_ADD(date, INTERVAL 14 DAY), '%Y-%m-%d') AS date_expire 
            FROM fines 
            WHERE driver_id = ? AND status = 'Not Paid'
        `, [driver_id]);

        // Check if there are unpaid fines associated with the driver
        if (finesRows.length === 0) return res.status(404).send('No unpaid fines found for this driver.');

        // Prepare the response structure
        const response = {
            driver_id: driverRows[0].driver_id,
            full_name: driverRows[0].full_name,
            license_id: driverRows[0].license_id,
            national_id: driverRows[0].national_id,
            fines: finesRows.map(fine => ({
                fine_id: fine.fine_id,
                offence_issue: fine.offence_issue,
                amount: fine.amount,
                date_issue: fine.date_issue,
                date_expire: fine.date_expire,
            })),
        };

        // Send the response as JSON
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});


module.exports = router;
