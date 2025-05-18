const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();  // Ensure .env is loaded
const config = require('./');
// console.log('JWT Secret:', config.secret);
// console.log('JWT Expiry:', config.expires_in);

const generateToken = (adminId) => {
  console.log('Generating token for:', adminId); // Debugging token generation
  return jwt.sign({ id: adminId }, config.secret, {
    expiresIn: config.expires_in || '1d',
  });
};

console.log('Exporting generateToken:', generateToken); // Debugging export
module.exports = generateToken;
