const express = require('express');
const { insertevent,getAllevent,getSingleevent } = require('../controllers/EventController');

const router = express.Router()


router.post('/insertevent',insertevent);
router.get('/getAllevent',getAllevent);
router.get('/getSingleevent',getSingleevent);
router.put('/updateevent',updateevent);
router.delete('/deleteevent',deleteevent);



module.exports= router;