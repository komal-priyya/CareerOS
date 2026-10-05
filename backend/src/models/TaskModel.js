const mongoose = require("mongoose")

const taskSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,
        default:" "
    },
    status:{
        type:String,
        required:true,
        enum:["pending","completed", "in-progress"],
        default:"pending"
    },
    priority:{
type:String,
required:true,
enum:["low","medium","high"],
default:"medium"
    },
    dueDate:{
        
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
    ref:"User",
        required:true

    }
},
    {timestamps:true,}
);
module.exports= mongoose.model("Task", taskSchema)