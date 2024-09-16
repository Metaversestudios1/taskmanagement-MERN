const mongoose = require('mongoose');
const { json } = require('body-parser');
const Holiday = require('../models/Holidays');
const { updateEmployee } = require('./EmployeeController');

const insertholiday = async (req, res) => {
    try {
        const newholiday = new Holiday(req.body);
        const y = await newholiday.save();
        res.status(201).json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: "error inserting holiday", error: err.message });
    }
}

const getAllholiday = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;
        const query = {
            deleted_at: null,
        }
        if (search) {
            query.reason = { $regex: search, $options: "i" };
        }
        const result = await Holiday.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count =await  Holiday.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching data", error: error })
    }
}
const getSingleHoliday = async (req, res) => {
    const { id } = req.body;
    try {

        const result = await Holiday.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "holiday not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching holiday" });
    }
}
const updateholiday = async (req, res) => {
    const updatdata = req.body;
    const id = updatdata.id;
    try {
        const result = await Holiday.updateOne(
            { _id: id },
            { $set: updatdata.oldData }
        )
        if (!result) {
            res.status(404).json({ success: false, message: "holiday not found" });
        }
        res.status(201).json({ success: true, result: result });

    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching holiday" });
    }
}
const deleteholiday = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await Holiday.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "holi not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching holiday" });
    }
}
const getholidaynotification = async (req, res) => {
    try {
      // Calculate the date for 3 days from now (to ensure the range covers the entire day of the 3rd day)
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
      // Set the time of 'today' to the start of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
  
      const query = {
        deleted_at: null,
        date: {
          $gte: today, // From the start of today
          $lte: threeDaysFromNow // Up to 3 days from now
        }
      };
  
      const result = await Holiday.find(query).sort({ date: -1 }); // Sort by date in descending order
      const count = result.length; // Count the number of holidays returned
  
      res.status(200).json({ success: true, result, count });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching holidays",
        error: error.message,
      });
    }
  };
  
  
  
module.exports = {
    insertholiday,
    getAllholiday,
    getSingleHoliday,
    updateholiday,
    deleteholiday,
    getholidaynotification
}