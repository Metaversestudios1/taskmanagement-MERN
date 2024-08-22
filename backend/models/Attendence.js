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
        type:String,
        required:true
    },
    check_out:{
        type:String,
        default:null
    },
    location_url:{type: String},
    working_hours:{
        type:Number,
        default:null
    },
    attendance_status:{ 
        type:String,
        default:null
    },
    deleted_at:{
        type:Date,
        default:null
    }
},{ timestamps:true, collection : 'attendence'}); 

module.exports = mongoose.model('Attendence',AttendenceSchema);