const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const auth = require('./Middleware/auth'); // Adjust the path as needed
const session= require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config();
connectDB();

const corsOptions = {
    origin: 'http://localhost:3001', // specify the allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // specify the allowed methods
    credentials: true, // include credentials like cookies in the request
    
};
 
// Enable CORS with specific options
app.use(cors(corsOptions)); 

app.use(session({
  secret: process.env.SESSION_SECRET, // Use session secret from environment variables
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

const dashboardRoutes = require('./routes/dashboardRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes')
const projectRoutes = require('./routes/ProjectRoutes')
const roleRoutes = require('./routes/RoleRoutes')
const PermissionRoutes = require('./routes/PermissionRoutes')
const TaskRoutes = require('./routes/TaskRoutes');
const AttendenceRoutes = require('./routes/AttendenceRoutes');
const LeaveRoutes = require('./routes/LeaveRoutes');

app.use('/api', dashboardRoutes);
app.use('/api',employeeRoutes);
app.use('/api', projectRoutes);
app.use('/api', roleRoutes);
app.use('/api', PermissionRoutes);
app.use('/api', TaskRoutes);
app.use('/api', AttendenceRoutes);
app.use('/api', LeaveRoutes);


app.get('/protected', auth, (req, res) => {
    res.json({success: true, message: "you are authorize", user: req.user});
  });


app.use('/', async (req, res) => {  
      res.json('ok');
  });
const port  = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


