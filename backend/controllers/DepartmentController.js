const Department = require("../models/Department");

const insertdepartment = async (req, res) => {
     try{
      console.log(req.body)
        const newdept = new Department(req.body);
        await newdept.save();
        res.status(201).json({ success: true });

    }catch(err){
        res.status(500).json({success:false,message:"error in  inserting the department",error:err.message});
    }
}
const updatedepartment = async (req, res) =>{
    const updatedata= req.body;
    const id = updatedata.id 
    try{
        const result = await Department.updateOne(
            {_id:id},
            { $set : updatedata.oldData}
        )
        if(!result){
            return res
            .status(404)
            .json({ success: false, message: "department not found" });
        }
        res.status(201).json({success:true});
    
    }catch(error){
        res.status(500).json({success:false,message:"error updating the department",error:error.message});
    }
}

const getalldepartment = async (req, res)=>{
    try {
        const pageSize = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const search = req.query.search;
        const query = {
          deleted_at: null,
        };
        if (search) {
          query.department_name = { $regex: search, $options: "i" }; // Add search condition if provided
         
        }
    
        const result = await Department.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * pageSize)
          .limit(pageSize);
        const count = await Department.find(query).countDocuments();
        res.status(201).json({ success: true, result, count });
      } catch (err) {
        res
          .status(500)
          .json({
            success: false,
            message: "Error fetching Department ",
            error: err.message,
          });
      }
}

const getSingleDepartment = async(req, res) => {
    const  { id } = req.body;
    try{
        const data = await Department.find({_id:id})
        if (!data) {
            return res
              .status(404)
              .json({ success: false, message: "Department not found" });
          }
          res.status(200).json({
            success: true,
            data,
          });
      

    }catch(err){
        res
        .status(500)
        .json({
          success: false,
          message: "Error fetching Department ",
          error: error.message,
        });
    }
}


const deletedepartment = async(req, res) => {
    try{
        const { id } = req.body;
        const result = await Department.findByIdAndUpdate(
            id,
            { deleted_at:new Date()},
            { new: true}
        );
        if (!result) {
            return res.status(404).json({  success: false,message: "department not found" });
          }
          res.status(200).json({
            success: true,
            data: result
          });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "error fetching department" });
    }
}


module.exports= {
    insertdepartment,
    updatedepartment,
    getalldepartment,
    getSingleDepartment,
    deletedepartment

}