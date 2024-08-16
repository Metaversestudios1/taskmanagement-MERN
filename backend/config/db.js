const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
         await mongoose.connect(process.env.MONGO_URI);
        //await mongoose.connect("mongodb+srv://socialtridentverse:ODNTcEyh1SJNJeW3@taskmanagement.xs0sq.mongodb.net/taskmanagement?retryWrites=true&w=majority");
        console.log('MongoDB connected');
    } catch (error) {
        if (error.message.includes('database exists')) {
            console.log('Database already exists.');
        } else {
            console.error('Error connecting to MongoDB:', error.message);
        }
        process.exit(1);
    }
};

module.exports = connectDB;
