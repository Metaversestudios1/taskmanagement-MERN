const { json } = require("body-parser");
const Attendence = require("../models/Attendence"); // Import the model
const mongoose = require("mongoose");
// Function to insert data

const insertattendence = async (req, res) => {
  try {
    const newAttendence = new Attendence(req.body);
    await newAttendence.save();
    res.status(201).json({ success: true, data: newAttendence });
  } catch (error) {
    res.status(500).json({
      success: false,
      messsage: "inserting attendence errror",
      error: error.message,
    });
  }
};
const getAllattendence = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const id = req.query.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const query = {
      deleted_at: null,
    };

    if (search) {
      query.emp_id = { $regex: search, $option: "i" };
    }

    if (id) {
      query.emp_id = id;
    }
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const result = await Attendence.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Attendence.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attedence",
      error: error.message,
    });
  }
};
const updateattendence = async (req, res) => {
  const { emp_id, date } = req.body;
  // Convert the frontend date (already in 'YYYY-MM-DD' format) to a Date object
  const inputDate = new Date(date);

  // Adjust the time zone offset to ensure it matches local time
  const localTime = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000);
  const dateString = localTime.toISOString().split("T")[0];

  try {
    // Use $expr and $dateToString to match only the date part
    const result = await Attendence.findOne({
      emp_id,
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          dateString,
        ],
      },
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const check_in = result["check_in"]; // Convert the stored check_in to a Date object
    const check_out = new Date();
    const working_minutes = check_out - check_in;
    const working_hours = working_minutes / (1000 * 60 * 60);
    const roundedDurationHours = Math.round(working_hours * 100) / 100;

    let attendance_status;
    if (roundedDurationHours >= 8) {
      attendance_status = "present";
      res.status(200).json({ success: true });
    } else {
      attendance_status = "absent";
      res.status(200).json({ success: true });
    }

    await Attendence.updateOne(
      { emp_id, date: result.date },
      {
        $set: {
          check_out: check_out,
          working_hours: roundedDurationHours,
          attendance_status: attendance_status,
        },
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating attendance",
      error: error.message,
    });
  }
};

const deleteattendence = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Attendence.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!result) {
      res.status(404).json({ success: false, message: "attedence not found" });
    }
    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error deleteding attedence",
      error: error.message,
    });
  }
};
const getSingleattendence = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Attendence.findOne({ emp_id: id });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "attedendence not found" });
    }
    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error fetching data",
      error: error.message,
    });
  }
};

module.exports = {
  insertattendence,
  updateattendence,
  getAllattendence,
  deleteattendence,
  getSingleattendence,
};
