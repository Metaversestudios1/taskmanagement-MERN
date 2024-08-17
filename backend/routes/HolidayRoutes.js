const { insertholiday ,getAllholiday,getSingleHoliday,updateholiday,deleteholiday} = require('../controllers/HolidayController');
const express = require('express');

const router = express.Router();

router.post('/insertholiday',insertholiday);
router.get('/getAllholiday',getAllholiday);
router.post('/getSingleHoliday',getSingleHoliday);
router.put('/updateholiday',updateholiday);
router.delete('/deleteholiday',deleteholiday);


module.exports= router;