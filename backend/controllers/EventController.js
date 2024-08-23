const mongoose = require('mongoose');
const { json } = require('body-parser');
const Event = require('../models/Events');

const insertevent  = async (req, res) => {
 try{
    const newholiday = new Event(req.body);
    await newholiday.save();
    res.status(201).json({ success: true })
 }catch(error){
    res.status(500).json({success:false,message:"error inserting event",error:error.message});
 }
}
const getAllevent = async (req,res) => {
    try{
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        const query = {
            deleted_at: null,
        };
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        const result = await Event.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const count = await Event.find(query).countDocuments();
        res.status(200).json({ success: true, result, count });

    }catch(error){
        res.status(500).json({success:false,message:"error inserting event"});
     }
}
const getSingleevent = async(req, res) => {
    const { id } = req.body;
    try {

        const result = await Event.findOne({ _id: id });
        if (!result) {
            res.status(404).json({ success: false, message: "event not found" });
        }
        res.status(201).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching event" });
    }
}
const updateevent = async(req,res) => {
    const updatdata = req.body;
    const id = updatdata.id;
    try {
        const result = await Event.updateOne(
            { _id: id },
            { $set: updatdata.oldData }
        )
        if (!result) {
            res.status(404).json({ success: false, message: "event not found" });
        }
        res.status(201).json({ success: true, result: result });

    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching event" });
    }
}
const deleteevent = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await Event.findByIdAndUpdate(
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
module.exports={
    getAllevent,
    insertevent,
    getSingleevent,
    deleteevent,
    updateevent

}