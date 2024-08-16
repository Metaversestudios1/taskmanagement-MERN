const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        unique: true
    },
    permission: {
        type: [String], // Array of strings
        required: true
    },
    status: {
        type: Number,
        default: 1 // Tinyint equivalent
    },
  
    deleted_at: {
        type: Date,
        default: null
    }
}, { timestamps: true, collection: 'role' });

module.exports = mongoose.model('Role', roleSchema);
