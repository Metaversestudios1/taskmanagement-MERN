const { insertholiday ,getAllholiday,getholidaynotification,getSingleHoliday,updateholiday,deleteholiday} = require('../controllers/HolidayController');
const express = require('express');

const router = express.Router();

router.post('/insertholiday',insertholiday);
router.get('/getAllholiday',getAllholiday);
router.post('/getSingleHoliday',getSingleHoliday);
router.put('/updateholiday',updateholiday);
router.delete('/deleteholiday',deleteholiday);
router.post('/getholidaynotification',getholidaynotification);




module.exports= router;