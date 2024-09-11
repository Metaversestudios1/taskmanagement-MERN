const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    personal_email: {
      type: String,
      required: true,
    },
    company_email: { type: String },
    contact_number: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Example validation for a 10-digit phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    department: { type: String },
    designation: { type: String },
    photo: {
      publicId: { type: String },
      url: { type: String },
      originalname: { type: String },
      mimetype: { type: String },
    },
    employee_type: {
      type: String,
    },
    shift_timing: { type: String },
    permanent_address: { type: String },
    current_address: { type: String },
    work_location: { type: String },
    joining_date: { type: Date },
    reporting_manager: { type: String },
    date_of_birth: { type: Date },
    marriage_anniversary: { type: Date },
    document: {
      publicId: { type: String },
      url: { type: String },
      originalname: { type: String },
      mimetype: { type: String },
    }, // Assuming the document is stored as a file URL or path
    nationality: { type: String },
    gender: { type: String },
    experience: { type: String },
    hobbies: { type: String },
    education: { type: String },
    skills: { type: String },
    relative_name:{type: String},
    relative_contact:{type: String, required: true},
    relative_relation:{type: String},
    bank_details: {
      acc_no: { type: String },
      ifsc_code: { type: String },
      acc_holder_name: { type: String },
      bank_name: { type: String },
      branch: { type: String },
    },
    resetOtp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    status: {
      type: Number,
      default: 0, // Tinyint equivalent
    },

    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "employees" }
);

module.exports = mongoose.model("Employee", employeeSchema);
