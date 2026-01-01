const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Totes les rutes requereixen autenticació i rol d'admin
router.use(auth);
router.use(roleCheck(['admin']));

// GET /api/admin/users - Obtenir tots els usuaris
router.get('/users', adminController.getAllUsers);

// GET /api/admin/tasks - Obtenir totes les tasques de tots els usuaris
router.get('/tasks', adminController.getAllTasks);

// DELETE /api/admin/users/:id - Eliminar un usuari i les seves tasques
router.delete('/users/:id', adminController.deleteUser);

// PUT /api/admin/users/:id/role - Canviar el rol d'un usuari
router.put('/users/:id/role', adminController.changeUserRole);

module.exports = router;