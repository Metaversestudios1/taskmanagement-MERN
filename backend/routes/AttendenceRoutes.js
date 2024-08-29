const express = require('express');
const {insertattendence,updateattendence,getAllattendence,deleteattendence,getSingleattendence, updateAttendanceStatus}= require('../controllers/AttedenceController');

const router = express.Router();
router.get('/getAllattendence',getAllattendence);
router.post('/insertattendence',insertattendence);
router.post('/updateattendence',updateattendence);
router.post('/updateAttendanceStatus',updateAttendanceStatus);
  
 router.delete('/deleteattendence', deleteattendence);
 router.post('/getSingleattendence',getSingleattendence);
module.exports= router;