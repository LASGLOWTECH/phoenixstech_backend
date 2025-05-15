
const config = require('../config'); // 👈 import your config object
require('dotenv').config();

const db = require('../db'); // your existing database connection
const bcrypt = require('bcrypt');
const generateToken = require('../config/generatetoken')

const ADMIN_EMAIL = config.adminemail
const ADMIN_PASSWORD = config.adminpass
const saltRounds = 10;

// LOGIN FUNCTION
const login = (req, res) => {
  const { email, password } = req.body;

  const selectQuery = 'SELECT * FROM admins WHERE email = ?';
  db.query(selectQuery, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length === 0) {
      // If admin is not found, insert the admin
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

      const insertQuery = 'INSERT IGNORE INTO admins (email, password) VALUES (?, ?)';
      db.query(insertQuery, [ADMIN_EMAIL, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: 'DB insert failed', error: err });

        const token = generateToken (ADMIN_EMAIL);

        return res
          .cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          })
          .status(200)
          .json({ message: 'Login successful', admin: { email: ADMIN_EMAIL } });
      });
    } else {
      // If admin is found, compare the password
      const admin = results[0];
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

      const token = generateToken(admin.email);
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .status(200)
        .json({ message: 'Login successful', admin: { email: admin.email } });
    }
  });
};

// LOGOUT FUNCTION
const logout = (req, res) => {
  res
    .clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .status(200)
    .json({ message: 'Logged out successfully' });
};

// ✅ Export both functions
module.exports = {
  login,
  logout
};
