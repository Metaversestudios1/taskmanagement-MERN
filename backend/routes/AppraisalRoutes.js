const express = require('express');
const { insertappraisal,getallAppraisal,getSingleAppraisal,updateappraisal ,deleteappraisal} = require('../controllers/AppraisalController');

const router = express.Router()


router.post('/insertappraisal',insertappraisal);
router.get('/getallAppraisal',getallAppraisal);
router.post('/getSingleAppraisal',getSingleAppraisal);
router.put('/updateappraisal',updateappraisal);
router.delete('/deleteappraisal',deleteappraisal);



module.exports= router;