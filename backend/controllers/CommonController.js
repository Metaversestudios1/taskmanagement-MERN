const activateOrDeactivate = async (model, id, newstatus) => {
    try {
      const status = newstatus === 1 ? "0" : "1";
      console.log(model);
      const updatedRecord = await model.findByIdAndUpdate(
        id,
        { status: status },
        { new: true } // Return the updated record
      );
  
      if (!updatedRecord) {
        throw new Error("Record not found");
      }
  
      return { success: true, data: updatedRecord }; // Return response
    } catch (err) {
      return { success: false, message: "Error updating status", error: err.message };
    }
  };
  
  module.exports = {
    activateOrDeactivate,
  };
  