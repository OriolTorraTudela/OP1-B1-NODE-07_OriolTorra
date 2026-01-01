const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ← Canviat

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: [2, 'El nom ha de tenir mínim 2 caràcters']
  },
  email: {
    type: String,
    required: [true, 'L\'email és obligatori'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Format d\'email invàlid']
  },
  password: {
    type: String,
    required: [true, 'La contrasenya és obligatòria'],
    minlength: [6, 'La contrasenya ha de tenir mínim 6 caràcters'],
    select: false  // ← Recomanat afegir això
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Pre-save hook: Xifrar la contrasenya abans de guardar
userSchema.pre('save', async function(next) {
  // Només xifrar si la contrasenya ha estat modificada
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generar salt amb 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Xifrar la contrasenya
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Mètode per comparar contrasenyes
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error al comparar contrasenyes');
  }
};

// Mètode toJSON: Eliminar la contrasenya quan es retorna l'usuari
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);