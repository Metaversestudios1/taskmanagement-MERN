const Project = require("../models/Project");
const Employee = require("../models/Employee");
const { generatePDF } = require('../utils/pdfGenerator');
const { sendEmailWithAttachment } = require('../utils/mailer');

const insertProject = async (req, res) => {
  try {
    const newproject = new Project(req.body);
    await newproject.save();
    res.status(201).json({
      success: true,
      data: newproject
    });

  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error inserting project", error: error.message });
  }
};
const getAllProject = async (req, res) => {
  try {
    const pageSize = req.query.limit;
    const page = req.query.page;
    const search = req.query.search;
    const filter = req.query.filter;
    const query = {
      deleted_at: null,
    };

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Add search condition if provided
    }

    let sortCondition = { createdAt: -1 }; // Default sort by createdAt descending
    if (filter === 'recent') {
      sortCondition = { start_date: 1 }; // Ascending order by start_date
    } else if (filter === 'oldest') {
      sortCondition = { start_date: -1 }; // Descending order by start_date
    } else if (filter === 'running') {
      query.status = 1; // Filter by status 1
    } else if (filter === 'closed') {
      query.status = 0; // Filter by status 0
    }
    const result = await Project.find(query)
      .sort(sortCondition)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Project.find(query).countDocuments();
    res.status(201).json({ success: true, result, count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching data: " + err.message });

  }
};
// Function to fetch all employees

const updateProject = async (req, res) => {
  const updateData = req.body; // Extract the update data from the request body
  const id = updateData.id;
  try {

    const result = await Project.updateOne(
      { _id: id },
      { $set: updateData.oldData }
    );
    if (!result) {

      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating data: " + err.message });

  }
};

const deleteProject = async (req, res) => {
  const { id } = req.body;  // Extract the ID from the request parameters

  try {
    // Update the deleted_at field to the current timestamp
    const result = await Project.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "project not found" });

    }

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({ sucess: false, message: "Error updating data: " + err.message });
  }
};
const publishproject = async (req, res) => {
  try {
    const { id, newStatus } = req.body;  // Corrected destructuring
    // Flip the status based on the current newStatus value
    const status = newStatus === 1 ? "0" : "1";  // Corrected variable reference to `newStatus`

    // Find the project by ID
    const project = await Project.findById(id);  // Use `findById` instead of `find` to get a single project
     const emp_id = project .assigned_manager;
     
    
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    
    //fetch company email of lead
    const employee = await Employee.findById(emp_id); // Find employee by ID
    const company_email = employee.company_email;
    
    if (!company_email) {
      return res.status(404).json({ success: false, message: "Lead's company email not found" });
    }
      // Prepare the content for the PDF
      const pdfContent = {
        'Project_Name': project.name,
        'Description': project.description,
        'Assigned_Manager': employee.name,
        'Milestones': project.no_of_milestones,
        'Start_Date': new Date(project.start_date).toLocaleDateString(),
        'End_Date': new Date(project.end_date).toLocaleDateString(),
      };
      
      const pdfBuffer = await generatePDF('project_details', pdfContent);

      // Send the email with the PDF attached
      await sendEmailWithAttachment(
        company_email, // Recipient email address
        'Project Publish details', // Email subject
        'Please find the attached PDF document.', // Email body
        pdfBuffer, // PDF content as buffer
        `project_details.pdf` // PDF filename
      );
     
    const updatedRecord = await Project.findByIdAndUpdate(
      id,
      { publish: status },
      { new: true }
    );


    if (!updatedRecord) {
      throw new Error("Failed to update the project status");
    }

    res.status(200).json({ success: true, message: "Project status updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in publishing project", error: err.message });
  }
};


const getSingleproject = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Project.find({ _id: id }); // Find the employee by ID

    if (!result) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching data: " + err.message });
  }
};
module.exports = {
  insertProject,
  getAllProject,
  updateProject,
  deleteProject,
  getSingleproject,
  publishproject,
};
