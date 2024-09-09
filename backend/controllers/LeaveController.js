const Leave = require("../models/Leave");
const GlobalLeave = require("../models/GlobalLeave");

const insertleave = async (req, res) => {
  try {
    const newleave = new Leave(req.body);
    await newleave.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error inserting leave",
      error: error.message,
    });
  }
};
const updateleave = async (req, res) => {
  const updateData = req.body;
  const id = updateData.id;
  try {
    const result = await Leave.updateOne(
      { _id: id },
      { $set: updateData.data }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "leave not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error updating leave",
      error: error.message,
    });
  }
};
const updateLeaveStatus = async (req, res) => {
  const { status, id } = req.body;
  try {
    const result = await Leave.updateOne({ _id: id }, { $set: { status } });
    if (!result) {
      res.status(404).json({ success: false, message: "leave not found" });
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error updating leave",
      error: error.message,
    });
  }
};
const deleteleave = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Leave.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "leave not found" });
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error deleting leave",
      error: error.message,
    });
  }
};
const getSingleleave = async (req, res) => {
  const { id } = req.body;

  try {
    const result = await Leave.findOne({ _id: id });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "leave not found" });
    }
    res.status(201).json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error fetching leave",
      error: error.message,
    });
  }
};
const getAllLeave = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const id = req.query.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const query = {
      deleted_at: null,
    };

    if (id) {
      query.emp_id = id;
    }
    if (startDate && endDate) {
      query.leave_from = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.leave_from = { $gte: startDate };
    } else if (endDate) {
      query.leave_from = { $lte: endDate };
    }
    const result = await Leave.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Leave.find(query).countDocuments();
    query.status = "approved";
    const approved = await Leave.find(query).countDocuments();
    query.status = "rejected";
    const rejected = await Leave.find(query).countDocuments();
    query.status = "pending";
    const pending = await Leave.find(query).countDocuments();
    res
      .status(200)
      .json({ success: true, result, count, approved, pending, rejected });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error fetching leave",
      error: error.message,
    });
  }
};

const updateGlobalLeaveSetting = async (req, res) => {
  const {
    total_yearly_leaves,
    total_casual_yearly_leaves,
    total_sick_yearly_leaves,
  } = req.body;

  const update = await GlobalLeave.updateOne(
    {},
    {
      $set: {
        total_yearly_leaves,
        total_casual_yearly_leaves,
        total_sick_yearly_leaves,
      },
    }
  );

  res
    .status(200)
    .json({ success: true, message: "Leaves updated successfully." });
};

const getGlobalLeaveData = async (req, res) => {
  const result = await GlobalLeave.find({});
  if (!result) {
    return res.status(401).json({ success: false, message: "Data not found" });
  }
  res.status(200).json({ success: true, result });
};
module.exports = {
  insertleave,
  updateleave,
  deleteleave,
  getSingleleave,
  getAllLeave,
  updateLeaveStatus,
  updateGlobalLeaveSetting,
  getGlobalLeaveData,
};
