const mongoose = require('mongoose');

const permissionschema = new mongoose.Schema({
    permission: {
        type: String,
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
}, { timestamps: true, collection: 'permission' });

module.exports = mongoose.model('Permission', permissionschema);
