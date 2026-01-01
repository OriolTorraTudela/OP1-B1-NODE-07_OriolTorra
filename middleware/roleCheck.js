/**
 * Middleware per verificar el rol de l'usuari
 * @param {Array} roles - Array de rols permesos (ex: ['admin'])
 * @returns {Function} Middleware function
 */
const roleCheck = (roles) => {
  return (req, res, next) => {
    // Verificar que l'usuari estigui autenticat
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autoritzat. Si us plau, inicia sessió'
      });
    }

    // Verificar que l'usuari tingui el rol adequat
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tens permisos per accedir a aquest recurs'
      });
    }

    next();
  };
};

module.exports = roleCheck;