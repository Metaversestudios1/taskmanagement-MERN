const { default: mongoose } = require("mongoose");

const EventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    type:{
        type:String,
    },
    date:{
        type:Date,
    },
    location:{
        type:String
    },
    purpose:{
        type:String
    },
    organizer:{
        type:String
    },
    duration: {
        type: String,  // Store as a string "Start Time - End Time" or "Number of Hours"
        required: true
    },
    comments: {
        type: String
    },
    status:{
        type:Number,
        default:0
    },
    deleted_at:{
        type:Date,
        defaultL:null
    }
}, { timestamps:true, collection:"events"})


module.exports = mongoose.model('Event', EventSchema);
