const db = require('../db.js');

const createConsultation = async (req, res) => {
  const { firstName, lastName, email, message, resume } = req.body;
  // const resume = req.file ? req.file.filename : null;

  console.log("Body:", req.body);
  console.log("File:", req.file);

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [results] = await db.query('SELECT * FROM consultation_requests WHERE email = ?', [email]);

    if (results.length > 0) {
      return res.status(400).json({ error: 'You have already submitted a message.' });
    }

    const insertSql = "INSERT INTO consultation_requests (`firstName`, `lastName`, `email`, `message`, `resume`) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(insertSql, [firstName, lastName, email, message, resume]);

    res.status(200).json({ message: 'Details submitted successfully', id: result.insertId });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getConsultation = async (req, res) => {
  try {
    const [data] = await db.query('SELECT * FROM consultation_requests');
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve consultation requests' });
  }
};

module.exports = { getConsultation, createConsultation };
