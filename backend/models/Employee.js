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
    emergency_contact_number: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Example validation for a 10-digit phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: {
      type: String,
    },
    role: {
      type: String,
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
      enum: ["Full-time", "Part-time", "Freelancer"],
    },
    shift_timing: { type: String },
    address: { type: String },
    permanent_address: { type: String },
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
    experience: { type: String }, // You may want to define a more detailed structure if required
    bank_account_details: { type: String },
    hobbies_interests: { type: String },
    previous_job_history: { type: String },
    educational_qualification: { type: String },
    skills: { type: String },
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
