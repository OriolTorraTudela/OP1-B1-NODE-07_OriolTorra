const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware d'autenticació
 * Verifica el token JWT i afegeix l'usuari a req.user
 */
const auth = async (req, res, next) => {
  try {
    // 1. Extreure el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No autoritzat. Token no proporcionat'
      });
    }

    // Extreure el token (després de "Bearer ")
    const token = authHeader.split(' ')[1];

    // 2. Verificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token invàlid o expirat'
      });
    }

    // 3. Buscar l'usuari a la base de dades
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuari no trobat'
      });
    }

    // 4. Afegir l'usuari a la request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Error en middleware d\'autenticació:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

module.exports = auth;