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
        type:String,
        default: 0
    },
    bonuses: {
        type: Number,
        default: 0
      },
      deductions: {
        type: Number,
        default: 0
      },
      overtime: {
        type: Number,
        default: 0
      },
      grossSalary: {
        type: Number,
        required: true
      },
      netSalary: {
        type: Number,
        required: true
      },
      paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Check', 'Cash'],
        required: true
      },
      bankAccountDetails: {
        type: String,
        default: ''
      },
      paymentDate: {
        type: Date,
        required: true
      },
      remarks: {
        type: String,
        default: ''
      },
      status:{
        type:Number,
        default:0
      },
      deleted_at:{
        type:Date,
        default:null
      }
},{ timestamps:true, collation:'payroll'});

module.exports = mongoose.model('Payroll',payrollSchema);