
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// Pujada d'imatge local
exports.uploadLocal = function (req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No s'ha enviat cap arxiu"
    });
  }

  const fileUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;

  res.status(201).json({
    success: true,
    message: "Imatge pujada localment",
    image: {
      filename: req.file.filename,
      path: '/uploads/' + req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
};

// Pujada d'imatge a Cloudinary
exports.uploadCloud = function (req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No s'ha enviat cap arxiu"
    });
  }

  const filePath = req.file.path;

  cloudinary.uploader.upload(filePath, { folder: 'task-manager/images' })
    .then(function (result) {
      // Eliminar fitxer local temporal
      fs.unlink(filePath, function (err) {
        if (err) {
          console.error('Error eliminant fitxer temporal:', err.message);
        }
      });

      res.status(201).json({
        success: true,
        message: "Imatge pujada a Cloudinary",
        image: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes
        }
      });
    })
    .catch(function (error) {
      console.error('Error a Cloudinary:', error.message);

      res.status(500).json({
        success: false,
        message: "Error pujant imatge a Cloudinary",
        details: error.message
      });
    });
};
