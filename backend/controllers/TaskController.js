const { json } = require("body-parser");
const Task = require("../models/Task"); // Import the model
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadImage = async (filePath) => {
//   const options = {
//     use_filename: true,
//     unique_filename: false,
//     overwrite: true,
//     resource_type: "raw", // Set resource type to 'raw' for ZIP files
//   };

//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: "row", // Automatically detect file type
//       ...options, // Spread any additional options
//     });
//     return result; // Return the secure URL
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     throw new Error("Cloudinary upload failed");
//   }
// };

// const insertTask = async (req, res) => {
//   if (req.file) {
//    console.log("req.file is present")
//     const { originalname, path: filePath } = req.file;

//     try {
//       const taskData = req.body;
//       // Upload file to Cloudinary
//       const uploadResult = await uploadImage(filePath);
//       if (!uploadResult) {
//         return res
//           .status(500)
//           .json({ success: false, message: "File upload error" });
//       }

//       // Create new task with file information
//       const newTask = new Task({
//         ...taskData,
//         attachment: {
//           publicId: uploadResult.public_id,
//           url: uploadResult.secure_url,
//           originalname: originalname,
//           mimetype: req.file.mimetype,
//         },
//       });

//       await newTask.save();
//       res.status(201).json({ success: true });
//     } catch (error) {
//       res
//         .status(500)
//         .json({
//           success: false,
//           message: "Error inserting Task",
//           error: error.message,
//         });
//     } finally {
//       // Remove the file from the local filesystem


//       fs.unlink(filePath, (err) => {
//         if (err) console.error("Failed to delete file:", err);
//       });

//     }

//   }
//   else {
//   //  console.log("req.file is not present")

//     try {
//       const taskData = req.body;
//       // Create new task with file information
//       const newTask = new Task({
//         ...taskData
//       });

//       await newTask.save();
//       res.status(201).json({ success: true });
//     } catch (error) {
//       res
//         .status(500)
//         .json({
//           success: false,
//           message: "Error inserting Task",
//           error: error.message,
//         });
//     }
//   }


// };
const path = require('path'); // Include the path module to handle file extensions

const uploadImage = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype || typeof mimetype !== 'string') {

      return reject(new Error("MIME type is required and must be a string"));
    }
    
    let resourceType = "raw"; // Default to 'raw' for non-image/video files

    if (mimetype.startsWith("image")) {
      resourceType = "image";
    } else if (mimetype.startsWith("video")) {
      resourceType = "video";
    }else if (mimetype === "application/pdf") {
      resourceType = "raw"; // Explicitly set PDFs as raw
    }
    const fileExtension = path.extname(originalname);
    const fileNameWithoutExtension = path.basename(originalname, fileExtension);
    const publicId = `${fileNameWithoutExtension}${fileExtension}`; // Include extension in public_id

    const options = {
      resource_type: resourceType,
      public_id: publicId, // Set the public_id with extension
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const uploadStream = cloudinary.uploader.upload(`data:${mimetype};base64,${buffer.toString('base64')}`, options, (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return reject(new Error("Cloudinary upload failed"));
      }
      console.log("Cloudinary upload result:", result);
      resolve(result);
    });

    // uploadStream.end(buffer); // Upload the file from the buffer
  });
};

const insertTask = async (req, res) => {
  if (req.file) {
    console.log("req.file is present");
    const { originalname, buffer, mimetype } = req.file;
    if (!mimetype || typeof mimetype !== 'string') {
      console.error("Invalid MIME type:", mimetype);
      return res.status(400).json({ success: false, message: "Invalid MIME type" });
    }

    try {
      const taskData = req.body;
      // Upload file to Cloudinary
      const uploadResult = await uploadImage(buffer, originalname,mimetype);
      if (!uploadResult) {
        return res.status(500).json({ success: false, message: "File upload error" });
      }
    
      // Create new task with file information
      const newTask = new Task({
        ...taskData,
        attachment: {
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          originalname: originalname,
          mimetype: req.file.mimetype,
        },
      });

      await newTask.save();
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error inserting task:", error.message);
      res.status(500).json({
        success: false,
        message: "Error inserting Task",
        error: error.message,
      });
    }
  } else {
    console.log("req.file is not present");
    try {
      const taskData = req.body;

      // Create new task without file information
      const newTask = new Task({
        ...taskData,
      });

      await newTask.save();
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error inserting task without file:", error.message);
      res.status(500).json({
        success: false,
        message: "Error inserting Task",
        error: error.message,
      });
    }
  }
};
const getAllTask = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const id = req.query.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const query = {
      deleted_at: null,
    };

    if (search) {
      query.task_name = { $regex: search, $options: "i" };
    }
    if (id) {
      query.emp_id = id;
    }
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const result = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const count = await Task.find(query).countDocuments();

    res.status(201).json({ success: true, result, count });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data: " + err.message });
  }
};



const downloadFile = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const attachment = task.attachment;
    if (!attachment || !attachment.url) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    res.status(200).json({ success: true, attachment });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching file info: " + err.message,
      });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.body; // Get the ID from the request parameters

  try {

    const result = await Task.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "task not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating data: " + err.message });
  }
};

const updateTask = async (req, res) => {
 
  const updateData = req.body;
  const {id} = req.params;
  if (req.file) {
    console.log("req.file is present");
    const { originalname, buffer, mimetype } = req.file;
    if (!mimetype || typeof mimetype !== 'string') {
      console.error("Invalid MIME type:", mimetype);
      return res.status(400).json({ success: false, message: "Invalid MIME type" });
    }
    try {
      // Upload file to Cloudinary
      const uploadResult = await uploadImage(buffer, originalname,mimetype);
      if (!uploadResult) {
        return res.status(500).json({ success: false, message: "File upload error" });
      }
      const updatedTaskData = {
        ...updateData,
        attachment: {
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          originalname: originalname,
          mimetype: req.file.mimetype,
        },
      };

      const result = await Task.updateOne({ _id: id }, { $set: updatedTaskData });
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found or no changes made" });
      }
      res.status(200).json({ success: true });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error updating task",
          err: err.message,
        });
    }
  } else {
    // console.log("req.file is not present");

    try {
      // Update task without file
      const result = await Task.updateOne({ _id: id }, { $set: updateData });
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found or no changes made" });
      }
      res.status(200).json({ success: true });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error updating task",
          err: err.message,
        });
    }
  }
};

// const updateTask = async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   try {
//     if (req.file) {
//       const { originalname, path: filePath } = req.file;

//       // Upload file to Cloudinary
//       const uploadResult = await uploadImage(filePath);
//       if (!uploadResult) {
//         return res.status(500).json({ success: false, message: "File upload error" });
//       }

//       // Prepare updated task data with file information
//       updateData.attachment = {
//         publicId: uploadResult.public_id,
//         url: uploadResult.secure_url,
//         originalname: originalname,
//         mimetype: req.file.mimetype,
//       };

//       // Update the task in the database
//       const result = await Task.findByIdAndUpdate(id, { $set: updateData }, { new: true });
//       if (!result) {
//         return res.status(404).json({ success: false, message: "Task not found or no changes made" });
//       }

//       res.status(200).json({ success: true, data: result });
//     } else {
//       // Update task without file
//       const result = await Task.findByIdAndUpdate(id, { $set: updateData }, { new: true });
//       if (!result) {
//         return res.status(404).json({ success: false, message: "Task not found or no changes made" });
//       }

//       res.status(200).json({ success: true, data: result });
//     }
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating task",
//       error: err.message,
//     });
//   } finally {
//     if (req.file) {
//       // Remove the file from the local filesystem
//       fs.unlink(req.file.path, (err) => {
//         if (err) console.error("Failed to delete file:", err);
//       });
//     }
//   }
// };


const getSingletask = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await Task.find({ _id: id }); // Find the employee by ID
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "task not found" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data: " + err.message });
  }
};

module.exports = {
  insertTask,
  getAllTask,
  updateTask,
  deleteTask,
  getSingletask,
  downloadFile,
};
