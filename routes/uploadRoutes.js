
const express = require('express');
const router = express.Router();

const uploadLocal = require('../middleware/uploadLocal');
const uploadCloud = require('../middleware/uploadCloud');
const uploadController = require('../controllers/uploadController');

// Pujar imatge localment
router.post('/local', function (req, res, next) {
  uploadLocal.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    uploadController.uploadLocal(req, res);
  });
});

// Pujar imatge a Cloudinary
router.post('/cloud', function (req, res, next) {
  uploadCloud.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    uploadController.uploadCloud(req, res);
  });
});

module.exports = router;
