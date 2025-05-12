


const express = require('express')
const router = express.Router();

const { GetContacts, submitContact

} = require('../controllers/contacts')

// GET method route


router.post('/', submitContact);
router.get('/', GetContacts)

module.exports = router