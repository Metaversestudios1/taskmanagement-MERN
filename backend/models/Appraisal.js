const mongoose = require('mongoose');

const appraisal_schema = new mongoose.Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    period_start: Date,
    period_end: Date,
    overall_rating: Number,
    feedback: String,
    goals_for_next_period: String,
    appraisal_date: Date,
    status: {
        type: Number,
        default: 0 // Tinyint equivalent
    },

    deleted_at: {
        type: Date,
        default: null
    }
}, { timestamps: true, collection: 'appraisal' });


module.exports = mongoose.model('Appraisal',appraisal_schema);