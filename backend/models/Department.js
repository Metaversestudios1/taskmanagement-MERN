const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    department_name: { type: String, required: true },
    department_head: { type: String, required: true },
    no_of_employee: { type: Number },
    description: { type: String },
    status: { type: Number, default: 0 },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true, collection: "department" }
);

module.exports = mongoose.model("Department", DepartmentSchema);
