const express = require('express');
const { insertEmployee, getAllEmployees,updateEmployee,deleteEmployee,resetPassword ,getSingleEmployee,login,logout,changePassword,sendotp,verifyOtp,deleteEmployeePhoto,loginmobile} = require('../controllers/EmployeeController');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
  fileFilter: (req, file, cb) => { 
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only certain files are allowed!'), false);
    }
  }
});

router.get('/getemployee', getAllEmployees);
router.post('/insertemployee',upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]),insertEmployee);
router.post('/login',  login);
router.put('/updatemployee',upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), updateEmployee);

// Route to delete an employee by ID
router.delete('/deleteemployee', deleteEmployee);
router.post('/getesingleemployee', getSingleEmployee);
router.post('/changePassword',changePassword);
router.post('/resetPassword',resetPassword);
router.post('/logout', logout);
router.post('/verifyOtp', verifyOtp);
router.post('/deleteEmployeePhoto',deleteEmployeePhoto);
router.post('/sendotp', sendotp);
router.post('/loginmobile', loginmobile);
router.post('/getemployeenotification', getemployeenotification);

module.exports = router;
