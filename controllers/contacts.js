const db = require('../db.js')


const submitContact = (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;
  
    // 1. Check if the email already exists
    const checkSql = 'SELECT * FROM contacts WHERE email = ?';
    db.query(checkSql, [email], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length > 0) {
        // Email already submitted
        return res.status(400).json({ error: 'You have already submitted a message.' });
      }
  
      // 2. Insert the new contact if email doesn't exist
      const insertSql = "INSERT INTO contacts (`firstName`, `lastName`, `email`, `subject`, `message`) VALUES (?,?,?,?,?)";
  
      db.query(insertSql, [firstName, lastName, email, subject, message], (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Database error during insert' });
        }
        res.status(200).json({ message: 'Contact submitted successfully', id: result.insertId });
      });
    });
  };
  
  
 
  
  const GetContacts= (req, res) => {
    const q = " SELECT * FROM contacts"
  
    db.query(q, (err, data) => {
  
            if (err) return res.status(500).send(err)
            return res.status(200).json(data)
    })
  };
  
  module.exports ={  submitContact, GetContacts}