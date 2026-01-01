const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Amb CLOUDINARY_URL, la SDK ja llegeix automàticament cloud_name, api_key i api_secret
cloudinary.config({
  secure: true,  // només forçar HTTPS
});

// DEBUG: veure què està utilitzant realment
console.log('--- CLOUDINARY CONFIG ---');
console.log(cloudinary.config());
console.log('-------------------------');

module.exports = cloudinary;
