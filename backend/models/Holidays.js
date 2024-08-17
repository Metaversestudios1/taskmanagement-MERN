const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
    Date:{
        type:Date,
        required:true
    },
    Reason:{
        type:String,
        required:true,
    },
    Day:{
        type:String,
    },
    Month:{
        type:String,
    },
    status:{
        type:Number,
        default:0
    },
    deleted_at:{
        type:Date,
        defaultL:null
    }
},{ timestamps:true , collection : 'holidays'})

module.exports= mongoose.model('Holiday',HolidaySchema);