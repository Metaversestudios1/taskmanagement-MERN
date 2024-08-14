const express= require('express');
const {insertRole, getAllrole, updateRole, deleteRole , getSingleRole}=require('../controllers/RoleController');
const router = express.Router();
router.get('/getrole',getAllrole);
router.post('/insertrole',insertRole);
router.put('/updaterole',updateRole);
router.delete('/deleterole',deleteRole);
router.post('/getSingleRole',getSingleRole);
module.exports =router
