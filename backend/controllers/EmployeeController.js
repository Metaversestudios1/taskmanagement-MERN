const { json } = require("body-parser");
const Employee = require("../models/Employee"); // Import the model
const Role = require("../models/Role"); // Import the model
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const path = require("path"); // Include the path module to handle file extensions
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const Permission = require("../models/Permission");
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadDocument = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype || typeof mimetype !== "string") {
      return reject(new Error("MIME type is required and must be a string"));
    }

    let resourceType = "raw"; // Default to 'raw' for non-image/video files

    if (mimetype.startsWith("image")) {
      resourceType = "image";
    } else if (mimetype.startsWith("video")) {
      resourceType = "video";
    } else if (mimetype === "application/pdf") {
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

    const uploadStream = cloudinary.uploader.upload(
      `data:${mimetype};base64,${buffer.toString("base64")}`,
      options,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Cloudinary upload failed"));
        }
        console.log("Cloudinary upload result:", result);
        resolve(result);
      }
    );

    // uploadStream.end(buffer); // Upload the file from the buffer
  });
};

const uploadImage = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype || typeof mimetype !== "string") {
      return reject(new Error("MIME type is required and must be a string"));
    }

    if (!mimetype.startsWith("image")) {
      return reject(new Error("Only image files are supported"));
    }

    const fileNameWithoutExtension = path.basename(originalname);
    const publicId = `${fileNameWithoutExtension}`;
    const options = {
      resource_type: "image", // Only images are allowed
      public_id: publicId,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const dataURI = `data:${mimetype};base64,${buffer.toString("base64")}`;

    cloudinary.uploader.upload(
      dataURI,
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        }
        resolve(result);
      }
    );
  });
};

const deleteImage = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const insertEmployee = async (req, res) => {
  try {
    const { password, ...employeeData } = req.body; // Extract password from req.body
    if (
      !password ||
      !employeeData.name ||
      !employeeData.role ||
      !employeeData.contact_number
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Please provide all fields" });
    }
    if (password.length < 4) {
      return res.status(401).json({
        success: false,
        message: "Password must contain minimum 4 digits",
      });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let photo = null;
    let document = null;

    try {
      if (req.files) {
        // Handle photo
        if (
          req.files["photo"] &&
          req.files["photo"][0] &&
          req.files["photo"][0].buffer
        ) {
          const photoFile = req.files["photo"][0];
          const photoFileName = photoFile.originalname.toLowerCase();
          if (
            photoFileName.includes("photo") ||
            photoFile.mimetype.startsWith("image/")
          ) {
            const uploadResult = await uploadImage(
              photoFile.buffer,
              photoFile.originalname,
              photoFile.mimetype
            );
            photo = {
              publicId: uploadResult.public_id,
              url: uploadResult.secure_url,
              originalname: photoFile.originalname,
              mimetype: photoFile.mimetype,
            };
          } else {
            // Handle unsupported file type
            return res.status(400).json({
              success: false,
              message: "Unsupported file type for photo",
            });
          }
        }

        // Handle document
        if (
          req.files["document"] &&
          req.files["document"][0] &&
          req.files["document"][0].buffer
        ) {
          const documentFile = req.files["document"][0];
          const documentFileName = documentFile.originalname.toLowerCase();
          // Accept both application files and images as documents
          if (
            documentFileName.includes("document") ||
            documentFile.mimetype.startsWith("application/") ||
            documentFile.mimetype.startsWith("image/")
          ) {
            const uploadResult = await uploadDocument(
              documentFile.buffer,
              documentFile.originalname,
              documentFile.mimetype
            );
            document = {
              publicId: uploadResult.public_id,
              url: uploadResult.secure_url,
              originalname: documentFile.originalname,
              mimetype: documentFile.mimetype,
            };
          } else {
            // Handle unsupported file type
            return res.status(400).json({
              success: false,
              message: "Unsupported file type for document",
            });
          }
        }
      } else {
        console.log("No files were uploaded");
      }
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: "Error inserting employee",
        error: uploadError.message,
      });
    }

    // Create new employee with hashed password
    const newEmployee = new Employee({
      ...employeeData,
      password: hashedPassword,
      photo: photo || undefined,
      document: document || undefined,
    });

    await newEmployee.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error inserting employee",
      error: error.message,
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const query = {
      deleted_at: null,
    };

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Add search condition if provided
    }

    const result = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Employee.find(query).countDocuments();
    res.status(201).json({ success: true, result, count });
  } catch (err) {
    throw new Error("Error fetching data: " + err.message);
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body; // Get the ID from the request parameters

  try {
    // Update the deleted_at field to the current timestamp
    const result = await Employee.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating data: " + err.message });
  }
};
const updateEmployee = async (req, res) => {
  const updateData = req.body; // Extract the update data from the request body
  const id = updateData.id;

  try {
    let photo = null;
    let document = null;
    // console.log(req.files)
    if (req.files) {
      // Handle photo
      if (
        req.files["photo"] &&
        req.files["photo"][0] &&
        req.files["photo"][0].buffer
      ) {
        // console.log(req.files['photo']);
        const photoFile = req.files["photo"][0];
        const photoFileName = photoFile.originalname.toLowerCase();
        if (
          photoFileName.includes("photo") ||
          photoFile.mimetype.startsWith("image/")
        ) {
          const uploadResult = await uploadImage(
            photoFile.buffer,
            photoFile.originalname,
            photoFile.mimetype
          );
          photo = {
            publicId: uploadResult.public_id,
            url: uploadResult.secure_url,
            originalname: photoFile.originalname,
            mimetype: photoFile.mimetype,
          };
        } else {
          return res.status(400).json({
            success: false,
            message: "Unsupported file type for photo",
          });
        }
      }

      // Handle document
      if (
        req.files["document"] &&
        req.files["document"][0] &&
        req.files["document"][0].buffer
      ) {
        const documentFile = req.files["document"][0];
        const documentFileName = documentFile.originalname.toLowerCase();
        if (
          documentFileName.includes("document") ||
          documentFile.mimetype.startsWith("application/") ||
          documentFile.mimetype.startsWith("image/")
        ) {
          const uploadResult = await uploadDocument(
            documentFile.buffer,
            documentFile.originalname,
            documentFile.mimetype
          );
          document = {
            publicId: uploadResult.public_id,
            url: uploadResult.secure_url,
            originalname: documentFile.originalname,
            mimetype: documentFile.mimetype,
          };
        } else {
          return res.status(400).json({
            success: false,
            message: "Unsupported file type for document",
          });
        }
      }
    }

    // Parse updateData.oldData safely
    let updateFields = {};
    if (updateData.oldData) {
      try {
        updateFields = JSON.parse(updateData.oldData);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for oldData",
        });
      }
    }

    // Include new file data if available
    if (photo) {
      updateFields.photo = photo;
    }
    if (document) {
      updateFields.document = document;
    }

    const result = await Employee.updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Employee not found or no changes made",
        });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating data: " + err.message,
    });
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await Employee.find({ _id: id }); // Find the employee by ID
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
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

const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Find user by email
    if (!email || !password) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide all fields" });
    }
    const user = await Employee.findOne({ email, role });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    // Get the role of the user
    const roleObject = await Role.findOne({ _id: user.role, deleted: null });
    if (!roleObject) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }
    // Fetch permissions for the role
    const permissions = await Promise.all(
      roleObject.permission.map(async (permId) => {
        const perm = await Permission.findById({ _id: permId });
        return perm ? perm.permission : null;
      })
    );

    // Create token with role and permissions
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: roleObject.role,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const options = {
      expires: new Date(Date.now() + 2592000000), // 30 days
      httpOnly: true,
      sameSite: "None",
    };
    res.cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const loginmobile = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    if (!email || !password) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide all fields" });
    }
    const user = await Employee.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }
    // Create token with role and permissions
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const options = {
      expires: new Date(Date.now() + 2592000000), // 30 days
      httpOnly: true,
      sameSite: "None",
    };
    res.cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to logout: " + err.message });
    }
    res.clearCookie("connect.sid"); // Name of the session ID cookie
    res.clearCookie("token"); // Name of the session ID cookie
    res.status(200).json({ status: true, message: "Successfully logged out" });
  });
};

const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  try {
    // Find user by email
    const user = await Employee.findOne({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the new password
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been changed successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const sendotp = async (req, res) => {
  const { email } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const update = await Employee.updateOne(
      { email: employee.email },
      {
        $set: {
          resetOtp: otp,
          otpExpires: otpExpires,
        },
      }
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Find employee by email and OTP
    const employee = await Employee.findOne({ email });
    if (!employee || employee.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (employee.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await Employee.findOne({ email });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();
  res.status(200).json({ success: true });
};
const deleteEmployeePhoto = async (req, res) => {
  const { id } = req.body;
  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Check if there's an existing photo to delete from Cloudinary
    if (employee.photo && employee.photo.publicId) {
      await deleteImage(employee.photo.publicId); // Delete the photo from Cloudinary
    }
    const result = await Employee.updateOne(
      { _id: id },
      { $unset: { photo: "" } } // Use $unset to remove the photo field
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "error updating leave",
        error: error.message,
      });
  }
};
module.exports = {
  insertEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
  login,
  logout,
  changePassword,
  sendotp,
  verifyOtp,
  resetPassword,
  deleteEmployeePhoto,
  loginmobile,
};
