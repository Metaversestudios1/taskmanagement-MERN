const express = require('express');
const { insertPermission, getAllPermission,updatePermission,deletePermission ,getSinglePermission} = require('../controllers/PermissionController');

const router = express.Router();

router.get('/getpermission', getAllPermission);
router.post('/insertpermission', insertPermission);
router.put('/updatpermission', updatePermission);
  
router.delete('/deletepermission', deletePermission);
// router.post('/getesinglepermission', getSinglePermission);
module.exports = router;
