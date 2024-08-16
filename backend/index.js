const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Employee = require('./models/Employee'); // Import the Employee model
// Define a schema and model

//const Employee = mongoose.model('Employee', employeeSchema);

// Define a controller with data handling functions
const insertEmployee = async (employeeData) => {
  try {
    const newEmployee = new Employee(employeeData);
    return await newEmployee.save();
  } catch (err) {
    throw new Error('Error inserting data: ' + err.message);
  }
};

const getAllEmployees = async () => {
  try {
    return await Employee.find();
  } catch (err) {
    throw new Error('Error fetching data: ' + err.message);
  }
};
const deleteEmployee = async () => {
    try {
      return await Employee.findByIdAndDelete();
    } catch (err) {
      throw new Error('Error fetching data: ' + err.message);
    }
  };

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Replace this with your MongoDB connection string
const uri = 'mongodb://localhost:27017/taskmanagment';

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

app.delete('/employees/:id', async (req, res) => {
    try {
      const result = await deleteEmployee(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
// Route to add an employee
app.post('/employees', async (req, res) => {
  try {
    const result = await insertEmployee(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Route to get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
