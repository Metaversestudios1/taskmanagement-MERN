const { json } = require("body-parser");
const Permission = require("../models/Permission"); // Import the model
const mongoose = require("mongoose");
// Function to insert data
const insertPermission = async (req, res) => {
  try {
    const body = req.body
    if(!body.permission) {
      return res.status(401).json({success: false, message:"Please provide the field"})
    }
    const newPermission = new Permission(body); // Ensure req.body contains all required fields
    await newPermission.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success:false,message: "Error inserting Permission", error: error.message });
  }
};

const getAllPermission = async (req, res) => {
  try {
    const pageSize = req.query.limit;
    const page = req.query.page;
    const search = req.query.search;
    const query = {
      deleted_at: null,
    };

    if (search) {
      query.permission = { $regex: search, $options: "i" }; // Add search condition if provided
    }
    const result = await Permission.find(query)
    .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Permission.find(query).countDocuments();
    res.status(201).json({success:true,result, count});
  } catch (err) {
    res.status(500).json({sucess:false, message: "Error fetching data: " + err.message });
   
  }
};

const deletePermission = async (req, res) => {
  const { id } = req.body; // Get the ID from the request parameters

  try {
    // Update the deleted_at field to the current timestamp
    const result = await Permission.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!result) {
       return res.status(404).json({ success:false,message: "Permission not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false,message: "Error updating data: " + err.message });
  }
};

const updatePermission = async (req, res) => {
  //const id = req.body.id; // Extract the ID from the request parameters
  const updateData = req.body; // Extract the update data from the request body
  const id = updateData.id;
  
  try {
  
    const result = await Permission.updateOne(
      { _id: id },
      { $set: updateData.oldData }
    );
    if (!result) {
      return res.status(404).json({ success:false,message: "permission not found" });
    }
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({sucess:false, message: "Error updating data: " + err.message });
   
  }
};

const getSinglePermission = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await Permission.find({ _id: id }); // Find the employee by ID
    if (!data) {
       return res.status(404).json({ success:false,message: "Permission not found" });
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({sucess:false, message: "Error fetching data: " + err.message });
   
  }
};

module.exports = {
  insertPermission,
  getAllPermission,
  updatePermission,
  deletePermission,
  getSinglePermission,
};
