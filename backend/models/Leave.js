const  mongoose  = require("mongoose");

const LeaveSchema = new mongoose.Schema({
    emp_id:{
        type:String,
        required:true
    },
    leave_type:{
        type:String,
        //Enum:['Seek Leave','Casual Leave','']
        required:true,
    },
    leave_from:{ 
        type:Date,
        required:true
    },
    leave_to:{
        type:Date,
        required:true
    },
    no_of_days:{
        type:Number,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    remark:{
        type:String
    },
    status: {
        type: String,
        default: "pending"
    },
  
    deleted_at: {
        type: Date,
        default: null
    }
},{ timestamps:true,collection:'leave'});

module.exports = mongoose.model('Leave',LeaveSchema); 