const { sendSubscriptionEmail } = require('../utils/mailer');
const db = require('../db.js');

// Subscribe a new email
const Subscribed = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [results] = await db.query('SELECT * FROM email_subscriptions WHERE email = ?', [email]);

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    await db.query('INSERT INTO email_subscriptions (email) VALUES (?)', [email]);

    try {
      await sendSubscriptionEmail(email);
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      // Optional: you can choose to notify user or not about this failure
    }

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all subscribers ordered by subscription date (descending)
const GetSubscribers = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM email_subscriptions ORDER BY subscribed_at DESC');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { Subscribed, GetSubscribers };
