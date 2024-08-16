const express = require('express');
const {insertattendence,updateattendence,getAllattendence,deleteattendence,getSingleattendence}= require('../controllers/AttedenceController');

const router = express.Router();
router.get('/getAllattendence',getAllattendence);
router.post('/insertattendence',insertattendence);
router.post('/updateattendence',updateattendence);
  
 router.delete('/deleteattendence', deleteattendence);
 router.post('/getSingleattendence',getSingleattendence);
module.exports= router;