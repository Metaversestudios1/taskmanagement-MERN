const express = require('express');
const multer = require('multer');
const { insertTask, getAllTask, deleteTask, updateTask, getSingletask,downloadFile } = require('../controllers/TaskController');

const router = express.Router();

// const storage = multer.memoryStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     }
//   });
  
  
// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
//     fileFilter: (req, file, cb) => { 
//       // Allow all file types
//       if (file.mimetype) {
//         cb(null, true);
//       } else {
//         cb(new Error('Invalid file type, only certain files are allowed!'), false);
//       }
//     }
//   });
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
  fileFilter: (req, file, cb) => { 
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only certain files are allowed!'), false);
    }
  }
});

router.get('/gettask', getAllTask);
router.post('/inserttask', upload.single('attachment'), insertTask);
router.put('/updatetask/:id', upload.single('attachment'), updateTask);
router.delete('/deletetask', deleteTask);
router.post('/getSingletask', getSingletask);
router.get('/tasks/:taskId/download', downloadFile);

module.exports = router;
