const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT amb la informació de l'usuari
 * @param {Object} user - Objecte usuari amb _id, email i role
 * @returns {String} Token JWT signat
 */
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;