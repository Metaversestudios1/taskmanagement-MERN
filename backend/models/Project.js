const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // unique: true
    },
    status: {
        type: Number,
        default: 1 // Tinyint equivalent
    },
   
   
    deleted_at: {
        type: Date,
        default: null
    }
}, { timestamps: true, collection: 'project' });

module.exports = mongoose.model('Project', projectSchema);
