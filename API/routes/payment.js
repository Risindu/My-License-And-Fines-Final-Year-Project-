const express = require('express');
const db = require('../models/db');
require('dotenv').config();
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // Ensure the secret key is loaded from .env
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Use your environment variable for webhook secret

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
    if (req.body.api_key !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
};

// Helper function to retrieve fine details
async function getFineDetails(fine_id) {
    const [fineRows] = await db.execute(`
        SELECT fine_id, driver_id, amount, description, status, category 
        FROM fines WHERE fine_id = ?
    `, [fine_id]);

    if (fineRows.length === 0) {
        throw new Error('Fine not found.');
    }

    return fineRows[0];
}

router.post('/driver/create-payment-intent', validateApiKey, async (req, res) => {
    try {
      const { fine_id, amount } = req.body;
  
      // Validate amount
      if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
  
      const fine = await getFineDetails(fine_id);
  
      if (fine.status === 'paid') {
        return res.status(400).json({ error: 'This fine is already paid' });
      }
  
      // Create payment intent with more details
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: 'lkr',
        payment_method_types: ['card'],
        metadata: {
          fine_id: fine.fine_id.toString(),
          driver_id: fine.driver_id.toString(),
          offence: fine.category,
        },
        description: `Fine payment for ${fine.category}`,
      });
  
      // Log the payment intent details for debugging
      console.log('Payment Intent created:', paymentIntent);
  
      // Return both client secret and payment intent ID
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        requiresAction: paymentIntent.status === 'requires_action',
        status: paymentIntent.status
      });
  
    } catch (err) {
      console.error('PaymentIntent Error:', err);
      res.status(500).json({
        error: 'Payment initialization failed',
        message: err.message
      });
    }
  });
  



  router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle successful payment
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded for PaymentIntent:', paymentIntent.id);
        // Your logic to update the database goes here
    }

    // Handle failed payment
    if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        console.error('Payment failed:', paymentIntent.id);
    }

    res.json({ received: true });
});

// Get payment status
router.get('/payment-status/:paymentIntentId', validateApiKey, async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            req.params.paymentIntentId
        );
        
        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency
        });
    } catch (err) {
        res.status(500).json({ error: 'Could not retrieve payment status' });
    }
});

// Verify payment completion
router.post('/verify-payment', validateApiKey, async (req, res) => {
    try {
        const { payment_intent_id } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
        
        if (paymentIntent.status === 'succeeded') {
            res.json({ verified: true });
        } else {
            res.json({ verified: false, status: paymentIntent.status });
        }
    } catch (err) {
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

// Route to fetch payment history
router.post('/driver/payment-history', async (req, res) => {
    const { driver_id, api_key } = req.body;

    try {
        if (api_key !== process.env.API_KEY) return res.status(400).send('Invalid API key.');

        const [payments] = await db.execute(`
            SELECT fine_id, amount, payment_date, status 
            FROM payments 
            WHERE driver_id = ?
            ORDER BY payment_date DESC
        `, [driver_id]);

        if (payments.length === 0) {
            return res.status(404).send('No payments found for this driver.');
        }

        res.json({ payments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve payment history.');
    }
});

module.exports = router;
