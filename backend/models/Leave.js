const  mongoose  = require("mongoose");

const LeaveSchema = new mongoose.Schema({
    Emp_id:{
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
        default:null
    },
    no_of_leaves_days:{
        type:Number,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    approval_status:{
        type:String,
        Enum:['pending','approved','rejected'],
    },
    remark:{
        type:String
    },
    leave_balance:{
        type:String
    },
    status: {
        type: Number,
        default: 1 // Tinyint equivalent
    },
  
    deleted_at: {
        type: Date,
        default: null
    }
},{ timestamps:true,collection:'leave'});

module.exports = mongoose.model('Leave',LeaveSchema); 