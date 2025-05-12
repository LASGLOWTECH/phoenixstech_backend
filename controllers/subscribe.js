const { sendSubscriptionEmail } = require('../utils/mailer');
const db = require('../db.js')

// Subscribed people
const Subscribed= (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    const q = 'SELECT * FROM email_subscriptions WHERE email = ?';
    db.query(q, [email], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (results.length > 0) {
        return res.status(409).json({ message: 'Email already subscribed' });
      }
  
      const q = 'INSERT INTO email_subscriptions (email) VALUES (?)';
      db.query(q, [email], async (err) => {
        if (err) return res.status(500).json({ error: err.message });
// Send subscription email
try {
    await sendSubscriptionEmail(email);
  } catch (emailErr) {
    console.error('Email send error:', emailErr);
  }

        return res.status(201).json({ message: 'Subscribed successfully' });
      });
    });
  };
  

  


  const GetSubscribers = (req, res) => {
    const query = 'SELECT * FROM email_subscriptions ORDER BY subscribed_at DESC';
  
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json(results);
    });
  };



  module.exports ={ Subscribed,  GetSubscribers}