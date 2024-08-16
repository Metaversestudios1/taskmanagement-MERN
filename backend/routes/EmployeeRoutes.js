const express = require('express');
const { insertEmployee, getAllEmployees,updateEmployee,deleteEmployee ,getSingleEmployee,login,logout,changePassword,} = require('../controllers/EmployeeController');

const router = express.Router();

router.get('/getemployee', getAllEmployees);
router.post('/insertemployee', insertEmployee);
router.post('/login',  login);
router.put('/updatemployee', updateEmployee);

// Route to delete an employee by ID
router.delete('/deleteemployee', deleteEmployee);
router.post('/getesingleemployee', getSingleEmployee);
router.post('/changePassword',changePassword);
router.post('/logout', logout);
module.exports = router;
