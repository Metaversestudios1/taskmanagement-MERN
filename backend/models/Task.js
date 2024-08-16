const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    emp_id: { type: String, required: true },
    project_name: {
      type: String, // Assuming project name is a number (perhaps an ID)
      required: true,
    },
    task_name: {
      type: String,
      required: true,
    },

    task_time: {
      type: String, // Assuming task time is stored as a string (e.g., "2 hours")
      required: true,
    },
    plan_for_tommorow: {
      type: String,
    },
    additional_comment: {
      type: String,
    },
    attachment: {
      publicId: { type: String},
      url: { type: String},
      originalname: { type: String },
      mimetype: { type: String },
    },
    backlog: {
      type: String,
    },
    status: {
      type: Number,
      default: 1, // Tinyint equivalent
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "task" }
);

module.exports = mongoose.model("Task", taskSchema);
