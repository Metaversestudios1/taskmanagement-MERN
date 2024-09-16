const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const GlobalLeave = require("../models/GlobalLeave");
const { sendEmail } = require('../utils/mailer');

const insertleave = async (req, res) => {
  try {
   
   const  {Emp_id} = req.body

   const employee = Employee.findOne({_id:Emp_id});
   if (!employee) {
    res.status(404).json({ success: false, message: "employee not found" });
  }
   const lead_id = employee.team_lead;
   const lead = Employee.findOne({_id:lead_id});
   if (!lead) {
    res.status(404).json({ success: false, message: "lead not found" });
  }
  // console.log(employee.name);
   const lead_email = lead.company_email;
   const leaveFrom = new Date(req.body.leave_from).toLocaleDateString('en-GB'); // Converts to dd-mm-yyyy
   const leaveTo = new Date(req.body.leave_to).toLocaleDateString('en-GB');     // Converts to dd-mm-yyyy
  
   await sendEmail(
    lead_email, // Recipient email address
    'Leave Request', // Email subject
    `<p>Dear Manager</p><p>A new leave request has been submitted by <strong>${employee.name}</strong>..</p><p><strong>From Date:</strong> ${leaveFrom}</p><p><strong>To Date:</strong> ${leaveTo}</p><p><strong>Reason:</strong> ${req.body.reason}</p><p>Please review and respond to the request accordingly.</p><p>Thank you<br/></p>`
  );
 

    // console.log(employee)
    const newleave = new Leave(req.body);
    await newleave.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error inserting leave",
      error: error.message,
    });
  }
};
const updateleave = async (req, res) => {
  const updateData = req.body;
  const id = updateData.id;
  try {
    const result = await Leave.updateOne(
      { _id: id },
      { $set: updateData.data }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "leave not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error updating leave",
      error: error.message,
    });
  }
};
const updateLeaveStatus = async (req, res) => {
  const { status, id } = req.body;
  try {
    const result = await Leave.updateOne({ _id: id }, { $set: { status } });
    if (!result) {
      res.status(404).json({ success: false, message: "leave not found" });
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error updating leave",
      error: error.message,
    });
  }
};
const deleteleave = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Leave.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "leave not found" });
    }
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error deleting leave",
      error: error.message,
    });
  }
};
const getSingleleave = async (req, res) => {
  const { id } = req.body;

  try {
    const result = await Leave.findOne({ _id: id });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "leave not found" });
    }
    res.status(201).json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error fetching leave",
      error: error.message,
    });
  }
};
const getAllLeave = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const id = req.query.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const query = {
      deleted_at: null,
    };

    if (id) {
      query.emp_id = id;
    }
    if (startDate && endDate) {
      query.leave_from = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.leave_from = { $gte: startDate };
    } else if (endDate) {
      query.leave_from = { $lte: endDate };
    }
    const result = await Leave.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Leave.find(query).countDocuments();
    query.status = "approved";
    const approved = await Leave.find(query).countDocuments();
    query.status = "rejected";
    const rejected = await Leave.find(query).countDocuments();
    query.status = "pending";
    const pending = await Leave.find(query).countDocuments();
    res
      .status(200)
      .json({ success: true, result, count, approved, pending, rejected });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error fetching leave",
      error: error.message,
    });
  }
};

const updateGlobalLeaveSetting = async (req, res) => {
  const {
    total_yearly_leaves,
    total_casual_yearly_leaves,
    total_sick_yearly_leaves,
  } = req.body;

  const update = await GlobalLeave.updateOne(
    {},
    {
      $set: {
        total_yearly_leaves,
        total_casual_yearly_leaves,
        total_sick_yearly_leaves,
      },
    }
  );

  res
    .status(200)
    .json({ success: true, message: "Leaves updated successfully." });
};

const getGlobalLeaveData = async (req, res) => {
  const result = await GlobalLeave.find({});
  if (!result) {
    return res.status(401).json({ success: false, message: "Data not found" });
  }
  res.status(200).json({ success: true, result });
};

// const getleavenotification = async(req,res)=>{
//   try {
//     const query = {
//       deleted_at: null,
//       status:'pending'
//     };

//     const leaves = await Leave.find(query)
//       .sort({ createdAt: -1 })

//     const  empID = result.map(leave =>leave.Emp_id);
//     const employee = await Employee.find({_id:{ $in:empID}})
//     const employeemap = employee.reduce((map,employee)=>{
//       map[employee.emp_id] =employee.name
//       return map;
//     },{})
//       // Add employee names to leave documents
//       const result = leaves.map(leave => ({
//         ...leave.toObject(),
//         employeeName: employeeMap[leave.emp_id] || 'Unknown'
//       }));
  
//       const count = leaves.length;
//     const count = await Leave.find(query).countDocuments();

//     res
//       .status(200)
//       .json({ success: true, result,  count});
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "error fetching leave",
//       error: error.message,
//     });
//   }
// }
const getleavenotification = async (req, res) => {
  try {
    const query = {
      deleted_at: null,
      status: 'pending'
    };

    // Fetch leave documents
    const leaves = await Leave.find(query).sort({ createdAt: -1 });

    // Extract emp_ids from leave documents
    const empIds = leaves.map(leave => leave.emp_id);
    
    // Fetch employee details for the extracted emp_ids
    const employees = await Employee.find({ _id: { $in: empIds } });
  
    // Create a map for employee data by emp_id
    const employeeMap = employees.reduce((map, employee) => {
      map[employee._id] = employee.name;
      return map;
    }, {});

    // Add employee names to leave documents
    const result = leaves.map(leave => ({
      ...leave.toObject(),
      employeeName: employeeMap[leave.emp_id] || 'Unknown'
    }));
    const count = leaves.length;

    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave",
      error: error.message,
    });
  }
};

module.exports = {
  insertleave,
  updateleave,
  deleteleave,
  getSingleleave,
  getAllLeave,
  updateLeaveStatus,
  updateGlobalLeaveSetting,
  getGlobalLeaveData,
  getleavenotification,
};
