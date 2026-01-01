const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Protegir totes les rutes amb autenticació
router.use(auth);

// Rutes de l'API REST de tasques

// EstadÃ­stiques
router.get('/stats', taskController.getTaskStats);

// CRUD bÃ sic
router.post('/', taskController.createTask);        // Crear tasca
router.get('/', taskController.getAllTasks);        // Obtenir totes les tasques
router.get('/:id', taskController.getTaskById);     // Obtenir tasca per ID
router.put('/:id', taskController.updateTask);      // Actualitzar tasca
router.delete('/:id', taskController.deleteTask);   // Eliminar tasca

// GestiÃ³ d'imatges de les tasques
router.put('/:id/image', taskController.updateTaskImage);             // Actualitzar imatge
router.put('/:id/image/reset', taskController.resetTaskImageToDefault); // Restablir imatge per defecte

module.exports = router;