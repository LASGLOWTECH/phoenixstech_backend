const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Mock user database (replace with real DB in production)
const users = [];

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'sPlease provide all fields.' });
    }

    // Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = { id: users.length + 1, username, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully.', user: { id: newUser.id, username, email } });
});

module.exports = router;