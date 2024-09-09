const express = require('express');
const { activateOrDeactivate } = require('../controllers/CommonController');
const router = express.Router();

router.post('/updatestatus/:model/:id', async(req,res) => {
    const {id ,model }= req.params;
    const {status} = req.body;
    const dynamicModel = require(`../models/${model}`);
    const result = await activateOrDeactivate(dynamicModel,id, status);
    if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
})

module.exports = router;
