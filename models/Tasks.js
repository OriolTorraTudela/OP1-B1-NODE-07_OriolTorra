const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // Camp title - Tipus string - Obligatori
    title: {
        type: String,
        required: true
    },
    // Camp description - Tipus string
    description: {
        type: String 
    },
    // Camp cost - Tipus number - Obligatori
    cost: {
        type: Number,
        required: true 
    },
    // Camp hours_estimated - Tipus number - Obligatori
    hours_estimated: {
        type: Number,
        required: true
    },
    // Camp hours_real - Tipus number
    hours_real: {
        type: Number
    },
    // Camp image - Tipus string (la url de la img)
    image: {
        type: String
    },
    // Camp completed - Tipus boolean - per defecte false
    completed: {
        type: Boolean,
        default: false
    },
    // Camp finished_at - Tipus data
    finished_at: {
        type: Date
    },
    // Camp user - Referència a l'usuari propietari
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model('Task', taskSchema);