const Employee = require("../models/Employee"); //
const Project = require("../models/Project");
const Task = require("../models/Task"); // Import the model
const getDashboardDataCount = async (req, res) => {
    try {
        const dashboardCount = await Employee.countDocuments({ deleted_at: null });
        res.status(200).json({ count: dashboardCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const getProjectCount = async(req, res)=>{
    try{
        const projectcount = await Project.countDocuments({ deleted_at: null });
        res.status(200).json({success:true,count:projectcount});
    } catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
    }
}
const gettodaystask = async(req,res)=>{
    try{
        const startofToday = new Date();
        startofToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const todaysTaskCount = await Task.countDocuments({
            createdAt:{
                $gte:startofToday,
                $lt:endOfToday
            },deleted_at:null
        });
        res.status(200).json({
            sucess:true,
            count:todaysTaskCount
        })
    }catch(err){
        res.status(500).json({sucess:false,message:'Server erro',err:err.message});
  

    }
}

const getAllTaskCount = async(req, res)=>{
    const id = req.query.id

    const count = await Task.find({emp_id:id,deleted_at:null}).countDocuments()
    res.status(200).json(count)
}


module.exports={
    getDashboardDataCount,
    getProjectCount,
    gettodaystask,
    getAllTaskCount
}
