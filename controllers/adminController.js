const User = require('../models/User');
const Task = require('../models/Tasks');

// Obtenir tots els usuaris (només admin)
exports.getAllUsers = function (req, res) {
  User.find().select('-password')
    .then(function (users) {
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    })
    .catch(function (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtenir els usuaris",
        details: error.message
      });
    });
};

// Obtenir totes les tasques de tots els usuaris (només admin)
exports.getAllTasks = function (req, res) {
  Task.find()
    .populate('user', 'name email role')
    .then(function (tasks) {
      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    })
    .catch(function (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtenir totes les tasques",
        details: error.message
      });
    });
};

// Eliminar un usuari i totes les seves tasques (només admin)
exports.deleteUser = function (req, res) {
  const userId = req.params.id;

  // No pot eliminar-se a si mateix
  if (userId === req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "No pots eliminar el teu propi usuari"
    });
  }

  User.findById(userId)
    .then(function (user) {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuari no trobat"
        });
      }

      // Eliminar totes les tasques de l'usuari
      return Task.deleteMany({ user: userId })
        .then(function (result) {
          // Eliminar l'usuari
          return User.findByIdAndDelete(userId);
        })
        .then(function (deletedUser) {
          res.status(200).json({
            success: true,
            message: "Usuari i les seves tasques eliminats correctament",
            data: {
              userId: deletedUser._id,
              email: deletedUser.email
            }
          });
        });
    })
    .catch(function (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar l'usuari",
        details: error.message
      });
    });
};

// Canviar el rol d'un usuari (user <-> admin) - només admin
exports.changeUserRole = function (req, res) {
  const userId = req.params.id;

  // No pot canviar el seu propi rol
  if (userId === req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "No pots canviar el teu propi rol"
    });
  }

  User.findById(userId)
    .then(function (user) {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuari no trobat"
        });
      }

      // Canviar el rol: user <-> admin
      const newRole = user.role === 'admin' ? 'user' : 'admin';

      return User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true, runValidators: true }
      ).select('-password');
    })
    .then(function (updatedUser) {
      res.status(200).json({
        success: true,
        message: "Rol d'usuari actualitzat correctament",
        data: updatedUser
      });
    })
    .catch(function (error) {
      res.status(500).json({
        success: false,
        message: "Error al canviar el rol de l'usuari",
        details: error.message
      });
    });
};