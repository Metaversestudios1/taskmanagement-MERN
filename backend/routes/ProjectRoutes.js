const express = require('express');
const { insertProject, getAllProject,deleteProject,updateProject,getSingleproject } = require('../controllers/ProjectController');

const router = express.Router();

router.get('/getproject', getAllProject);
router.post('/insertproject', insertProject);
router.put('/updateproject', updateProject);


// Route to delete an employee by ID
 router.delete('/deleteproject', deleteProject);
 router.post('/getSingleproject', getSingleproject);
module.exports = router;
