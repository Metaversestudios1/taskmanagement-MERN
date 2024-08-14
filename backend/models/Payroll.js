const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    emp_id:{
        type:String,
        required:true,
    },
    pay_period_start: { type: Date, required: true },
    pay_period_end: { type: Date, required: true },
    basic_salary: { type: Number, required: true },
    allowances: {
})