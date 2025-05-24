const db = require('../db'); // your existing database connection
const bcrypt = require('bcrypt');
const generateToken = require('../config/generatetoken');

const ADMIN_EMAIL = 'admin@phoenix.com';
const ADMIN_PASSWORD = 'phoenix123';
const saltRounds = 10;

// LOGIN FUNCTION
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (results.length === 0) {
      // Admin not found, insert admin with default password
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

      await db.query(
        'INSERT IGNORE INTO admins (email, password) VALUES (?, ?)',
        [ADMIN_EMAIL, hashedPassword]
      );

      const token = generateToken(ADMIN_EMAIL);

      return res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .status(200)
        .json({ message: 'Login successful', admin: { email: ADMIN_EMAIL } });
    }

    // Admin found, verify password
    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = generateToken(admin.email);
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(200)
      .json({ message: 'Login successful', admin: { email: admin.email } });

  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
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

module.exports = {
  login,
  logout,
};
