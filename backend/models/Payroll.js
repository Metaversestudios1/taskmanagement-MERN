const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    emp_id: {
      type: String,
      required: true,
    },
    salary: { type: String, required: true },
    designation: { type: String, required: true },
    status: {
      type: Number,
      default: 0,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "payrolls" }
);

module.exports = mongoose.model("Payroll", payrollSchema);
