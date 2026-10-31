const mongoose = require("mongoose")

const taskSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        // required:true,
        default:" ",
         trim: true
    },
    status:{
        type:String,
        required:true,
        enum:["pending","completed", "in-progress","cancelled"],
        default:"pending"
    },
    priority:{
type:String,
required:true,
enum:["low","medium","high"],
default:"medium"
    },
    dueDate:{
         type: Date,
      default: null  
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
    ref:"User",
        required:true

    },
    userName: {
  type: String,
  required: true
},
reqId: {
    type: String,
    required: true,
    trim: true
}
},

    {timestamps:true,}
);
taskSchema.index(
    { user: 1, reqId: 1 },
    { unique: true }
);

module.exports= mongoose.model("Task", taskSchema)

