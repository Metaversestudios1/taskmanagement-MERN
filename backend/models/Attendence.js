const  mongoose  = require("mongoose");

const AttendenceSchema = new mongoose.Schema({
    emp_id:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true
    },
    check_in:{
        type:Date,
        required:true
    },
    check_out:{
        type:Date,
        default:null
    },
    working_hours:{
        type:Number,
        default:null
    },
    attendance_status:{ 
        type:String,
        Enum:['Present','Absent'],
        default:null
    },
    deleted_at:{
        type:Date,
        default:null
    }
},{ timestamps:true, collection : 'attendence'}); 

module.exports = mongoose.model('Attendence',AttendenceSchema);