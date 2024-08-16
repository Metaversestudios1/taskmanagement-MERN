const { json } = require("body-parser");
const Employee = require("../models/Employee"); // Import the model
const Role = require("../models/Role"); // Import the model
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const jwt = require("jsonwebtoken");

const insertEmployee = async (req, res) => {
  try {
    const { password, ...employeeData } = req.body; // Extract password from req.body
    if (
      !password ||
      !employeeData.name ||
      !employeeData.email ||
      !employeeData.role ||
      !employeeData.contact_number
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Please provide all fields" });
    }
    if (password.length < 4) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Password must contain minimum 4 digits",
        });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new employee with hashed password
    const newEmployee = new Employee({
      ...employeeData,
      password: hashedPassword,
    });

    await newEmployee.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error inserting employee",
        error: error.message,
      });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const query = {
      deleted_at: null,
    };

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Add search condition if provided
    }

    const result = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Employee.find(query).countDocuments();
    res.status(201).json({ success: true, result, count });
  } catch (err) {
    throw new Error("Error fetching data: " + err.message);
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body; // Get the ID from the request parameters

  try {
    // Update the deleted_at field to the current timestamp
    const result = await Employee.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating data: " + err.message });
  }
};

const updateEmployee = async (req, res) => {
  //const id = req.body.id; // Extract the ID from the request parameters
  const updateData = req.body; // Extract the update data from the request body
  const id = updateData.id;
  try {
    const result = await Employee.updateOne(
      { _id: id },
      { $set: updateData.oldData }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    res.status(201).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating data: " + err.message });
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await Employee.find({ _id: id }); // Find the employee by ID
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
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

const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Find user by email
    if (!email || !password || !role) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide all fields" });
    }
    const user = await Employee.findOne({ email, role });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter Correct Password" });
    }
    const rolename = await Role.findOne({ _id: user.role, deleted: null });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: rolename.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const options = {
      expires: new Date(Date.now() + 2592000000),
      httpOnly: true,
      sameSite: "None",
    };
    res.cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to logout: " + err.message });
    }
    res.clearCookie("connect.sid"); // Name of the session ID cookie
    res.clearCookie("token"); // Name of the session ID cookie
    res.status(200).json({ status: true, message: "Successfully logged out" });
  });
};

const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  try {
    // Find user by email
    const user = await Employee.findOne({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the new password
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Password has been changed successfully",
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

module.exports = {
  insertEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
  login,
  logout,
  changePassword,
};
