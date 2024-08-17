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
    const count = await Attendence.find(query).countDocuments()
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attedence",
      error: error.message,
    });
  }
};

function getCurrentTime() {
  const date = new Date();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // Hour '0' should be '12'

  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  const timeString = `${hours}:${minutesStr} ${ampm}`;

  return timeString;
}
// Function to parse time string and return a Date object for the current date
const parseTimeString = (timeString) => {
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  return date;
};

// Function to calculate working hours
const calculateWorkingHours = (checkInTime, checkOutTime) => {
  const checkInDate = parseTimeString(checkInTime);
  const checkOutDate = parseTimeString(checkOutTime);

  const diffMs = checkOutDate - checkInDate; // Difference in milliseconds
  const diffHours = diffMs / (1000 * 60 * 60); // Convert to hours
  return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
};

const updateattendence = async (req, res) => {
  const { emp_id, date } = req.body;
  const check_out = getCurrentTime();
  try {
    const result = await Attendence.findOne({
      emp_id,
      date: new Date(date),
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const check_in = result["check_in"];
    const check_out_time = check_out; // This should be in string format like "2:29 PM"

    const roundedDurationHours = calculateWorkingHours(check_in, check_out_time);
    let attendance_status;
    if (roundedDurationHours >= 8) {
      attendance_status = "present";
    } else {
      attendance_status = "absent";
    }

    await Attendence.updateOne(
      { emp_id, date: result.date },
      {
        $set: {
          check_out: check_out_time, // Save as a string
          working_hours: roundedDurationHours,
          attendance_status: attendance_status,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
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
