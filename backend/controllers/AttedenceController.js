
const { json } = require("body-parser");
const Attendence = require("../models/Attendence"); // Import the model
const mongoose = require("mongoose");
const { countDocuments, updateOne, findOne } = require("../models/Employee");
// Function to insert data

const insertattendence = async (req, res) => {
    try {
        const newAttendence = new Attendence(req.body);
        await newAttendence.save();
        res.status(201).json({ success: true, data: newAttendence });
    } catch (error) {
        res.status(500).json({ success: false, messsage: "inserting attendence errror", error: error.message });
    }
}
const getAllattendence = async (req, res) => {

    try {
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;
        const query = {
            deleted_at: null,
        };

        if (search) {
            query.emp_id = { $regex: search, $option: "i" };
        }
        const result = await Attendence.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await countDocuments;
        res.status(200).json({ success: true, result, count });

    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Error fetching attedence",
                error: error.message,
            });
    }

}
const updateattendence = async (req, res) => {
    const updateData = req.body;
    const { emp_id, date } = updateData;

    try {
        const result = await Attendence.findOne(
            { emp_id, date },
        )
        console.log(result);

        if (!result) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        const check_in = result['check_in']; // Convert the stored check_in to a Date object
        const check_out = new Date();
        const working_minutes = check_out - check_in;
        const working_hours = working_minutes / (1000 * 60 * 60);
        const roundedDurationHours = Math.round(working_hours * 100) / 100;
        if (roundedDurationHours >= 8) {
            attendance_status = "present 1"
            res.status(200).json({ success: true })
        } else {
            attendance_status = "absent"
            res.status(200).json({ success: false })
        }
        result.check_out = check_out;
        await Attendence.updateOne(
            { emp_id, date },
            {
                $set: {
                    check_out: check_out,
                    working_hours: roundedDurationHours,
                    attendance_status: attendance_status
                }
            }
        );

    } catch (error) {
        res.status(500)
            .json({ success: false, message: "error updating attedence", error: error.message })
    }

}
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
        res.status(500).json({ success: false, message: "error deleteding attedence", error: error.message })
    }
}
const getSingleattendence = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await Attendence.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "attedendence not found" });
        }
        res.status(200).json({ success: true, result: result })

    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching data", error: error.message })
    }

}

module.exports = {
    insertattendence,
    updateattendence,
    getAllattendence,
    deleteattendence,
    getSingleattendence,
} 