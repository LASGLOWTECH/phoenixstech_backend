




const config = require('../config'); // 👈 import your config object
require('dotenv').config();

const nodemailer = require('nodemailer');
const mailchimp = require('@mailchimp/mailchimp_marketing');





// Nodemailer setups
const transporter = nodemailer.createTransport({
  host: 'phoenixstech.com',
  port: config.email_port,
  secure: true,
  auth: {
    user: 'info@phoenixstech.com',
    pass:config.email_pass// add this in your .env
  }
});



// Mailchimp setup
mailchimp.setConfig({
apiKey: config.apiKey,
  server: config.server
});
console.log(config.email_user);

const listId =  config.listid;

// Function to send confirmation email and add to Mailchimp
const sendSubscriptionEmail = async (toEmail) => {
  // 1. Send confirmation email
  const mailOptions = {
    from: '"phoenixstech" <info@phoenixstech.com>',
    to: toEmail,
    subject: 'Thank You for Subscribing!',
    html: `
      <h2>Welcome to phoenixstech!</h2>
      <p>You've successfully subscribed to our updates. We'll keep you informed.</p>
    `
  };
  await transporter.sendMail(mailOptions);

  // 2. Add to Mailchimp list
  try {
    await mailchimp.lists.addListMember(listId, {
      email_address: toEmail,
      status: 'subscribed',
    });
    console.log('Added to Mailchimp:', toEmail);
  } catch (err) {
    console.error('Mailchimp error:', err.response?.body || err.message);
    // Optional: still succeed if already subscribed
    if (err.response?.body?.title === 'Member Exists') {
      console.log('Email already exists in Mailchimp');
    } else {
      throw err;
    }
  }
};

module.exports = { sendSubscriptionEmail };
