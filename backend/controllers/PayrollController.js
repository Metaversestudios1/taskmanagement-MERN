const Payroll = require('../models/Payroll');
const { json }= require('body-parser');
const mongoose = require('mongoose');

const insertpayroll= async(req,res) => {

    try{
        const newroll =  new Payroll(req.body);
        await newroll.save();
        res.status(200).json({success:true});

    }catch(error){
        res.status(500).json({success:false,message:"error inserting payroll",error:error.message})
    }
}
const getAllPayroll = async (req, res) => {

    try {
      const pageSize = req.query.limit;
      const page = req.query.page;
      const id = req.query.id;
      const query = {
        deleted_at: null,
      };
  
      if(id) {
        query.emp_id = id
      }
      const result = await Payroll.find(query)
      .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const count = await Payroll.find(query).countDocuments();
      res.status(201).json({success:true,result, count});
    } catch (err) {
      res.status(500).json({sucess:false, message: "Error fetching data: " + err.message });
     
    }
  };
  
  const deletepayroll = async (req, res) => {
    const { id } = req.body; // Get the ID from the request parameters
  
    try {
      // Update the deleted_at field to the current timestamp
      const result = await Payroll.findByIdAndUpdate(
        id,
        { deleted_at: new Date() },
        { new: true }
      );
  
      if (!result) {
         return res.status(404).json({ success:false,message: "Payroll not found" });
      }
  
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false,message: "Error updating data: " + err.message });
    }
  };
  
  const updatepayroll = async (req, res) => {
    //const id = req.body.id; // Extract the ID from the request parameters
    const updateData = req.body; // Extract the update data from the request body
    const id = updateData.id;

    try {
    
      const result = await Payroll.updateOne(
        { _id: id },
        { $set: updateData.oldData }
      );
      if (!result) {
        return res.status(404).json({ success:false,message: "Payroll not found" });
      }
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({sucess:false, message: "Error updating data: " + err.message });
     
    }
  };
  
  const getSinglepayroll = async (req, res) => {
    try {
      const { id } = req.body;
  
      const data = await Payroll.find({ _id: id }); // Find the employee by ID
      if (!data) {
         return res.status(404).json({ success:false,message: "Payroll not found" });
      }
  
      res.status(200).json({
        success: true,
        data: data
      });
    } catch (err) {
      res.status(500).json({sucess:false, message: "Error fetching data: " + err.message });
     
    }
  };

module.exports={
    insertpayroll,
    getSinglepayroll,
    updatepayroll,
    getAllPayroll,
    deletepayroll,
}