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

module.exports={
    insertpayroll,
}