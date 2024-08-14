const express = require('express');
const { getDashboardDataCount ,getProjectCount, getAllTaskCount,gettodaystask} = require('../controllers/DashboardController');

const router = express.Router();

router.get('/getemployeecount', getDashboardDataCount);
router.get('/getprojectcount', getProjectCount);
router.get('/gettodaystask', gettodaystask);
router.get('/gettotaltasks', getAllTaskCount);

module.exports = router;

