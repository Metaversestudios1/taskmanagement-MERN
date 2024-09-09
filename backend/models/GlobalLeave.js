const mongoose = require("mongoose");

const GlobalLeaveSchema = new mongoose.Schema(
  {
    total_yearly_leaves: { type: Number, default: 0 },

    types_of_leave: { type: [String], default: ["casual leave", "sick leave"] },

    total_casual_yearly_leaves: { type: Number, default: 0 },

    total_sick_yearly_leaves: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "globalLeave" }
);

module.exports = mongoose.model("GlobalLeave", GlobalLeaveSchema);
