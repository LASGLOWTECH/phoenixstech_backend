const db = require('../db.js');
const { sendMailFromContactForm, addToMailchimpList } = require('../utils/submitmailer');

const submitContact = async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  try {
    // 1. Check if the email already exists
    const [results] = await db.query('SELECT * FROM contacts WHERE email = ?', [email]);

    if (results.length > 0) {
      return res.status(400).json({ error: 'You have already submitted a message.' });
    }

    const insertSql = "INSERT INTO contacts (`firstName`, `lastName`, `email`, `subject`, `message`) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(insertSql, [firstName, lastName, email, subject, message]);

    // 2. Send mail and add to Mailchimp (optional fallback if fails)
    try {
      await sendMailFromContactForm({ firstName, lastName, email, subject, message });
      await addToMailchimpList(email);
    } catch (error) {
      console.error('Post-submission task failed:', error);
    }

    res.status(200).json({ message: 'Contact submitted successfully', id: result.insertId });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const GetContacts = async (req, res) => {
  try {
    const [data] = await db.query('SELECT * FROM contacts');
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve contacts' });
  }
};

module.exports = {
  submitContact,
  GetContacts
};
