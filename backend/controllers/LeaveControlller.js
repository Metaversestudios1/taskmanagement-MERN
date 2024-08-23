const { json }=require('body-parser');
const Leave = require('../models/Leave');
const mongoose = require('mongoose');
const { findOne } = require('../models/Employee');

const insertleave = async(req, res)=>{
    try{
        console.log(req.body)
        const newleave = new Leave(req.body);
        await newleave.save();
        res.status(201).json({success:true});
    }catch(error){
        res
      .status(500)
      .json({
        success: false,
        message: "Error inserting leave",
        error: error.message,
      });   }

}
const updateleave = async(req, res) => {
     const updateData = req.body;
     const id = updateData.id;
     console.log(req.body);
    try{
        const result = await Leave.updateOne(
            {_id:id},
            { $set:updateData.data},
        );
        if (!result) {
            res.status(404).json({success:false,message:"leave not found"});
        }
        res.status(201).json({success:true,result:result})
    }catch(error){
        res.status(500).json({success:false,message:"error updating leave",error:error.message});
    }
}
const deleteleave = async (req , res)=>{
    const { id } = req.body;
    try{
        const result = await Leave.findByIdAndUpdate(
            id,
            {deleted_at:new Date()},
            {new: true}
        )
        if(!result){
            res.status(404).json({success:false,message:"leave not found"})
        }
        res.status(201).json({success:true})

    }catch(error){
        res.status(500).json({success:false,message:"error deleting leave",error:error.message});
    }
}
const getSingleleave = async (req, res) => {
    const { id } = req.body
    try{
        const result = await Leave.findOne({_id:id});
        if(!result){
            return res.status(404).json({success:false,message:"leave not found"})
        }
        res.status(201).json({success:true,result})
    }catch(error){
        res.status(500).json({success:false,message:"error fetching leave",error:error.message})
    }
}
const getAllLeave = async (req, res) => {
    try{
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page)
        const id = req.query.id;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const query  = {
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
          console.log(query)
        const result = await Leave.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
         const count = await Leave.find(query).countDocuments();
         res.status(200).json({ success: true, result, count });
    }catch(error){
        res.status(500).json({success:false,message:"error fetching leave",error:error.message})
    }
}
module.exports={
    insertleave,
    updateleave,
    deleteleave,
    getSingleleave,
    getAllLeave,
    updateLeaveStatus
}