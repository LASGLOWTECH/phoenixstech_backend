const express = require('express')
const db = require('../db.js')


const createConsultation = (req, res) => {
  const { firstName, lastName, email, message, resume } = req.body;
  // const resume = req.file ? req.file.filename : null;

  console.log("Body:", req.body);
  console.log("File:", req.file);

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const checkSql = 'SELECT * FROM consultation_requests WHERE email = ?';
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'You have already submitted a message.' });
    }

    const insertSql = "INSERT INTO consultation_requests (`firstName`, `lastName`, `email`, `message`, `resume`) VALUES (?)";
    const values = [firstName, lastName, email, message, resume];

    db.query(insertSql, [values], (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ error: 'Database error during insert' });
      }

      return res.status(200).json({ message: 'Details submitted successfully', id: result.insertId });
    });
  });
};


const getConsultation = (req, res) => {
  const q = " SELECT * FROM consultation_requests"

  db.query(q, (err, data) => {

    if (err) return res.status(500).send(err)
    return res.status(200).json(data)
  })
};

module.exports = { getConsultation, createConsultation }