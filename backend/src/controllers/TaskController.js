
const { default: mongoose } = require('mongoose');
const Task = require('../models/TaskModel')




const normalizeTask = (data) => ({
    title: data.title.trim(),
    description: data.description ?? " ",
    status: data.status ?? "pending",
    priority: data.priority ?? "medium",
    dueDate: data.dueDate
        ? new Date(data.dueDate).getTime()
        : null
});
// create Task
const createTask = async (req, res) => {

    try {

        const { title, description, status, priority, dueDate, reqId } = req.body;

        // rejects non-string titles and  rejects empty titles and titles containing only spaces
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }
        if (typeof reqId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reqId)
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid request ID is required"
            });


        }
        const todo = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            reqId,
            user: req.user._id,
            userName: req.user.name

        })

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: todo
        })
    }
    catch (error) {
        // MongoDB uses error code 11000 when an 
        // insertion violates a unique index.
        if (error.code === 11000) {
            const existingTask = await Task.findOne({
                user: req.user._id,
                reqId: req.body.reqId
            });

            if (existingTask) {
                const incoming = normalizeTask(req.body);
                const existing = normalizeTask(existingTask);

                if (JSON.stringify(incoming) !== JSON.stringify(existing)) {
                    return res.status(409).json({
                        success: false,
                        message: "Request ID already used for different task data"
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Task already created",
                    data: existingTask
                });

            }

            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    }
}
// GET ALL TASKS 
const getAllTasks = async (req, res) => {

    try {

       
        const tasks = await Task.find({
  user: req.user._id
}).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: tasks
        })

    } catch {
        console.error("Get tasks error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch tasks"
        })
    }
}
const deleteTask = async (req,res)=>{

try{

 const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }
     const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });


}catch(error){

    console.error("Delete task error:", error);

      return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });

}


}

 const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update"
      });
    }

    if (
      updates.title !== undefined &&
      (typeof updates.title !== "string" || !updates.title.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid task title is required"
      });
    }

    if (updates.title !== undefined) {
      updates.title = updates.title.trim();
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id
      },
      { $set: updates },
      {
        returnDocument: "after",   
        runValidators: true
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    });

  } catch (error) {
    if (error.name === "ValidationError" ||
        error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task"
    });
  }
}; 
module.exports = { createTask, getAllTasks , deleteTask,updateTask}

