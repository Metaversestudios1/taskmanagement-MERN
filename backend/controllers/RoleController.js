const { json } = require("body-parser");
const Role = require("../models/Role"); // Import the model
const mongoose = require("mongoose");
// Function to insert data
const insertRole = async (req, res) => {
  try {
    const newRole = new Role(req.body); // Ensure req.body contains all required fields
    await newRole.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error inserting role",
        error: error.message,
      });
  }
};

const getAllrole = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const query = {
      deleted_at: null,
    };
    if (search) {
      query.role = { $regex: search, $options: "i" }; // Add search condition if provided
     
    }

    const result = await Role.find(query)
      // console.log(result);
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Role.find(query).countDocuments();
    res.status(201).json({ success: true, result, count });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching role",
        error: error.message,
      });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.body; // Get the ID from the request parameters

  try {
    // Update the deleted_at field to the current timestamp
    const result = await Role.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating role",
        err: err.message,
      });
  }
};

const updateRole = async (req, res) => {
  //const id = req.body.id; // Extract the ID from the request parameters
  const updateData = req.body; // Extract the update data from the request body
  const id = updateData.id;
  try {
    const result = await Role.updateOne(
      { _id: id },
      { $set: updateData.oldData }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "role not found" });
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error delete data",
        error: error.message,
      });
  }
};

const getSingleRole = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await Role.find({ _id: id }); // Find the employee by ID
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data: " + err.message });
  }
};

module.exports = {
  insertRole,
  getAllrole,
  updateRole,
  deleteRole,
  getSingleRole,
};
