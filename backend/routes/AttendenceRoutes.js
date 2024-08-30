const express = require('express');
const {insertattendence,updateattendence,getAllattendence,deleteattendence,getSingleattendence, updateAttendanceStatus}= require('../controllers/AttedenceController');
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

router.get('/getAllattendence',getAllattendence);
router.post('/insertattendence', upload.single('photo'),insertattendence);
router.post('/updateattendence', upload.single('photo'),updateattendence);
router.post('/updateAttendanceStatus', updateAttendanceStatus);
  
 router.delete('/deleteattendence', deleteattendence);
 router.post('/getSingleattendence',getSingleattendence);
module.exports= router;