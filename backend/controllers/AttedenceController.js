const { json } = require("body-parser");
const Attendence = require("../models/Attendence");
const Employee = require("../models/Employee"); // Import the model
const mongoose = require("mongoose");
const axios = require('axios');
const sharp = require('sharp'); // Import sharp
const fs = require('fs');

const { PNG } = require('pngjs');
const resizeImage = async (buffer, width, height) => {
  return sharp(buffer)
    .resize(width, height)
    .toBuffer();
};

const comparePhotos = async (url1, buffer2) => {
  try {
    const { default: pixelmatch } = await import('pixelmatch');
    // Fetch the Cloudinary image as a buffer
    const response1 = await axios.get(url1, { responseType: 'arraybuffer' });
    const buffer1 = Buffer.from(response1.data);

    // Get dimensions of the first image
    const metadata1 = await sharp(buffer1).metadata();
    const { width, height } = metadata1;

    // Resize the second image to match the dimensions of the first
    const resizedBuffer2 = await resizeImage(buffer2, width, height);

    // Convert buffers to PNG images
    const img1 = PNG.sync.read(buffer1);
    const img2 = PNG.sync.read(resizedBuffer2);

    const diff = new PNG({ width, height });

    // Compare the images
    const numDiffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 } // Adjust the threshold for sensitivity
    );

    // Calculate similarity
    const similarity = 1 - numDiffPixels / (width * height);
    return similarity >= 0.8; // similarity is in the range [0, 1]
  } catch (error) {
    console.error('Error comparing photos:', error);
    return false;
  }
};

const insertattendence = async (req, res) => {
  try {
    const { emp_id } = req.body;
    const employee = await Employee.findOne({ _id: emp_id });
    if (req.file) {
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      
      if (employee.photo.url) {
        const isMatch = await comparePhotos(employee.photo.url, req.file.buffer);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: "Photo does not match",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "upload Profile pic first.",
        });
      }
    }
    const newAttendence = new Attendence(req.body);
    await newAttendence.save();
    res.status(201).json({ success: true, data: newAttendence });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in attendance error",
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
  const [time, period] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );
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
  const { emp_id, date, checkOut_location_url } = req.body;

  const employee = await Employee.findOne({ _id: emp_id });

  if (req.file) {
   
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    if (employee.photo.url) {
      const isMatch = await comparePhotos(employee.photo.url, req.file.buffer);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Photo does not match",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "upload Profile pic first.",
      });
    }
  }
  const check_out = getCurrentTime();
  try {
    const result = await Attendence.findOne({
      emp_id,
      date: new Date(date),
    });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const check_in = result["check_in"];
    const check_out_time = check_out; // This should be in string format like "2:29 PM"

    const roundedDurationHours = calculateWorkingHours(
      check_in,
      check_out_time
    );
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
          checkOut_location_url
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
  const { id, date } = req.body; // date from frontend, e.g., '2024-08-21'

  // Create a start of day and end of day date range
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1); // Move to the next day

  try {
    // Query for attendance with emp_id and date within the same day
    const result = await Attendence.findOne({
      emp_id: id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }

    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
};
const updateAttendanceStatus = async(req, res) =>{
  const {id, status} = req.body
  try{
    await Attendence.updateOne(
      { _id: id},
      {
        $set: {
          attendance_status:status
        },
      }
    )
    res.status(200).json({ success: true });
  }catch(err) {
    
    res.status(401).json({ err });
  }
}

module.exports = {
  insertattendence,
  updateattendence,
  getAllattendence,
  deleteattendence,
  getSingleattendence,
  updateAttendanceStatus
};
