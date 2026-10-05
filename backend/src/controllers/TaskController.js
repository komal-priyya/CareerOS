
const Task = require('../models/TaskModel')



// create Task
const createTask  = async(req,res)=>{

    try{

        const {task,description,status}= req.body;

        if(!task && !description && !status){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const todo = await Task.create({
    title,
    description,
    status,
    userId:req.user._id ,
    userName:req.user.name
        
    })

    return res.status(200).json({
        success:true,
        message:"task created successfully",
        data:todo
    })
}
    catch(error){
return res.status(500).json({
    success:false,
    message:error.message

})
    }



}
module.exports= {createTask}

