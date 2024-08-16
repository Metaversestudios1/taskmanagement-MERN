const express = require('express');
const{ insertpayroll }= require('../controllers/PayrollController');

const router = express.Router();
 
router.post('/insertpayroll',insertpayroll);
module.exports= router;