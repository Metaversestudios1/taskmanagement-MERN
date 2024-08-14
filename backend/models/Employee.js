const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact_number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Example validation for a 10-digit phone number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
    status: {
        type: Number,
        default: 0 // Tinyint equivalent
    },
  
    deleted_at: {
        type: Date,
        default: null
    }
}, { timestamps: true, collection: 'employees' });

module.exports = mongoose.model('Employee', employeeSchema);
