
const config = require('../config'); // 👈 import your config object
require('dotenv').config();

const nodemailer = require('nodemailer');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const transporter = nodemailer.createTransport({
  host: 'phoenixstech.com',
  port: config.email_port,
  secure: true,
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
});

const sendMailFromContactForm = async ({ firstName, lastName, email, subject, message }) => {
  const mailOptions = {
    from: `"${firstName} ${lastName}" <${email}>`, // 👈 dynamic from user input
    to: 'info@phoenixstech.com',                  // 👈 admin or your receiving email
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Mailchimp setup
mailchimp.setConfig({
  apiKey: config.apiKey,
  server: config.server,
});
const listId = config.listid;

// Add contact to Mailchimp list
const addToMailchimpList = async (email) => {
  try {
    await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'subscribed',
    });
    console.log(`Added ${email} to Mailchimp`);
  } catch (err) {
    if (err.response?.body?.title === 'Member Exists') {
      console.log('Email already exists in Mailchimp');
    } else {
      console.error('Mailchimp error:', err.response?.body || err.message);
      throw err;
    }
  }
};

module.exports = { sendMailFromContactForm, addToMailchimpList };
