const express = require('express');
const { insertdepartment,updatedepartment,getalldepartment,getSingleDepartment ,deletedepartment} = require('../controllers/DepartmentController');

const router = express.Router()
 

router.post('/insertdepartment',insertdepartment);
router.post('/getSingleDepartment',getSingleDepartment);
router.get('/getalldepartment',getalldepartment);
router.put('/updatedepartment',updatedepartment);
router.delete('/deletedepartment',deletedepartment);



module.exports= router;