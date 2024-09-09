const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // unique: true // If you want project names to be unique
    },
    scope_finalization_date: {
        type: Date
    },
    kickoff_date: {
        type: Date
    },
    no_of_milestones: {
        type: Number
    },
    no_of_sprints: {
        type: Number
    },
    assigned_manager: {
        type: String
    },
    designer: {
        type: String
    },
    developer: {
        type: String
    },
    project_duration: {
        type: Number, // Duration in days
    },
    no_of_assigned_manager: {
        type: Number
    },
    description: {
        type: String,
    },
    comment:{
        type: String,
    },
    status: {
        type: Number,
        enum: [0, 1, 2], // 0 = inactive, 1 = active, 2 = hold
        default: 1 // Default to 'active'
    },
    start_date: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date
    },
    deleted_at: {
        type: Date,
        default: null
    }
}, { timestamps: true, collection: 'project' });

module.exports = mongoose.model('Project', projectSchema);
