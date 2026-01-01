
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connexió a MongoDB correcte');
  app.listen(PORT, () => {
    console.log(`Servidor en marxa a http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('Error de connexió a MongoDB:', err.message);
});
