const mongoose = require('mongoose');
const { json } = require('body-parser');
const Appraisal = require('../models/Appraisal');

const insertappraisal = async (req, res) =>{
  console.log(req.body);
    try{
        const newapp = new Appraisal(req.body);
        await newapp.save();
        res.status(201).json({success:true});
        
    }catch(error){
         res.status(500).json({success:false,message:"error inserting appraisal",error:error.message});
    }
}

const updateappraisal = async(req ,res) => {
    const updatdata = req.body;
    const id = updatdata.id;
    try{
        const result = await Appraisal.updateOne(
            {_id:id},
            {$set:updatdata.oldData},
        )
        if(!result){
            return res
            .status(404)
            .json({ success: false, message: "appraisal not found" });
        }
        res.status(201).json({success:true});


    }catch(err){
        res.status(500).json({success:false,message:"error updating appraisal",error:err.message});
    }
}

const getallAppraisal = async (req, res)=>{
    try {
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;
        const query = {
          deleted_at: null,
        };
        if (search) {
          query.appraisal_date = { $regex: search, $options: "i" }; // Add search condition if provided
         
        }
        const result = await Appraisal.find(query)
          // console.log(result);
          .sort({ createdAt: -1 })
          .skip((page - 1) * pageSize)
          .limit(pageSize);
        const count = await Appraisal.find(query).countDocuments();
        res.status(201).json({ success: true, result, count });
      } catch (err) {
        res
          .status(500)
          .json({
            success: false,
            message: "Error fetching appraisal ",
            error: error.message,
          });
      }
}


const getSingleAppraisal = async(req, res) => {
    const  { id } = req.body;
    try{
        const data = await Appraisal.find({_id:id})
        if (!data) {
            return res
              .status(404)
              .json({ success: false, message: "Appraisal not found" });
          }
          res.status(200).json({
            success: true,
            data,
          });
      

    }catch(err){
        res
        .status(500)
        .json({
          success: false,
          message: "Error fetching Appraisal ",
          error: error.message,
        });
    }
}


const deleteappraisal = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await Appraisal.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "Appraisal not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching Appraisal" });
    }
}


module.exports= {
    insertappraisal,
    updateappraisal,
    getallAppraisal,
    getSingleAppraisal,
    deleteappraisal

}