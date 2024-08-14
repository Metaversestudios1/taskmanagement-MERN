const express = require('express');
const { insertleave ,updateleave,deleteleave,getSingleleave,getAllLeave}= require('../controllers/LeaveControlller');


const router = express.Router();

router.post('/insertleave',insertleave);
router.put('/updateleave',updateleave);
router.delete('/deleteleave',deleteleave);
router.get('/getSingleleave',getSingleleave);
router.get('/getAllLeave',getAllLeave)

module.exports=router;