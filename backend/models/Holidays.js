const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    reason:{
        type:String,
        required:true,
    },
    day:{
        type:String,
    },
    month:{
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