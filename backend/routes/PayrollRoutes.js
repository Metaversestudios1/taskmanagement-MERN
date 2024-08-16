const express = require('express');
const{ insertpayroll, getSinglepayroll, updatepayroll, getAllPayroll, deletepayroll, }= require('../controllers/PayrollController');

const router = express.Router();
 
router.post('/insertpayroll',insertpayroll);
router.get('/getSinglepayroll',getSinglepayroll);
router.put('/updatepayroll',updatepayroll);
router.get('/getAllPayroll',getAllPayroll);
router.delete('/deletepayroll',deletepayroll);
module.exports= router;