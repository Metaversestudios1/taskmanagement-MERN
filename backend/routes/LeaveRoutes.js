const express = require('express');
const { insertleave ,updateleave,deleteleave,updateLeaveStatus,getSingleleave,getAllLeave}= require('../controllers/LeaveControlller');


const router = express.Router();

router.post('/insertleave',insertleave);
router.put('/updateleave',updateleave);
router.put('/updateLeaveStatus',updateLeaveStatus);
router.delete('/deleteleave',deleteleave);
router.post('/getSingleleave',getSingleleave);
router.get('/getAllLeave',getAllLeave)

module.exports=router;