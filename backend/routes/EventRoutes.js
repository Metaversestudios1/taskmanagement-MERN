const express = require('express');
const { insertevent,getAllevent,getSingleevent,updateevent ,deleteevent} = require('../controllers/EventController');

const router = express.Router()


router.post('/insertevent',insertevent);
router.get('/getAllevent',getAllevent);
router.post('/getSingleevent',getSingleevent);
router.put('/updateevent',updateevent);
router.delete('/deleteevent',deleteevent);



module.exports= router;