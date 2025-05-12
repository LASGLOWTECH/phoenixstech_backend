


const express = require('express')
const router = express.Router();

const { Subscribed, GetSubscribers,

} = require('../controllers/subscribe')

// GET method route

router.post('/', Subscribed)
router.get('/', GetSubscribers)


module.exports = router