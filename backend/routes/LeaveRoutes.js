const express = require('express');
const { insertleave ,getleavenotification,updateleave,deleteleave,updateLeaveStatus,getGlobalLeaveData,getSingleleave,getAllLeave, updateGlobalLeaveSetting}= require('../controllers/LeaveController');


const router = express.Router();

router.post('/insertleave',insertleave);
router.put('/updateleave',updateleave);
router.put('/updateLeaveStatus',updateLeaveStatus);
router.delete('/deleteleave',deleteleave);
router.post('/getSingleleave',getSingleleave);
router.get('/getAllLeave',getAllLeave)
router.get('/getGlobalLeaveData',getGlobalLeaveData)
router.post('/updateGlobalLeave',updateGlobalLeaveSetting);
router.post('/getleavenotification',getleavenotification);


module.exports=router;