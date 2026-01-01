const express = require('express');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware per processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imatges estÃ tiques locals
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Rutes principals de l'API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('API REST per gestor de tasques activa');
});

// Middleware de gestió d'errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Si és un error personalitzat amb statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Error del servidor',
      details: err.details || null
    });
  }
  
  // Error genèric del servidor
  res.status(500).json({
    success: false,
    message: 'Error intern del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

module.exports = app;