const { body } = require('express-validator');

// Validació per al registre d'usuaris
const registerValidation = [
  body('email')
    .notEmpty()
    .withMessage('L\'email és obligatori')
    .isEmail()
    .withMessage('Format d\'email invàlid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contrasenya és obligatòria')
    .isLength({ min: 6 })
    .withMessage('La contrasenya ha de tenir mínim 6 caràcters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contrasenya ha de contenir almenys una majúscula, una minúscula i un número'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nom ha de tenir entre 2 i 100 caràcters')
    .trim()
];

// Validació per al login
const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('L\'email és obligatori')
    .isEmail()
    .withMessage('Format d\'email invàlid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contrasenya és obligatòria')
];

// Validació per canviar la contrasenya
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contrasenya actual és obligatòria'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('La nova contrasenya és obligatòria')
    .isLength({ min: 6 })
    .withMessage('La nova contrasenya ha de tenir mínim 6 caràcters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nova contrasenya ha de contenir almenys una majúscula, una minúscula i un número')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('La nova contrasenya no pot ser igual a l\'actual');
      }
      return true;
    })
];

// Validació per actualitzar el perfil
const updateProfileValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Format d\'email invàlid')
    .normalizeEmail(),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nom ha de tenir entre 2 i 100 caràcters')
    .trim()
];

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation
};