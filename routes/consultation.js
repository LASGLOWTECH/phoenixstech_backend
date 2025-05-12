const express = require('express');
const router = express.Router();
const fileUpload = require('../middlewares/upload');  // Ensure correct import
const { getConsultation, createConsultation } = require('../controllers/consultation');

// POST route for creating consultation
router.post('/', fileUpload.single('file'), createConsultation);  // ✅ Use the fileUpload middleware

// GET route for fetching consultations
router.get('/', getConsultation);

module.exports = router;
