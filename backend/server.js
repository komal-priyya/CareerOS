require("dotenv").config();
const TaskRoutes= require('./src/routes/TaskRoutes')
const express = require("express");
const cors = require("cors");
const connectDB= require("./src/db/db");
const authRoutes= require("./src/routes/authRoutes.js");
const cookieParser = require("cookie-parser");
const app = express();
connectDB()
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/test',(req,res)=>{
  console.log("Test route reached");
  res.json({
    message:"   server is working"
  });
})
app.use((req,res,next)=>{
  console.log("REQUEST:",req.method,req.url);
  next()
})
app.use('/api/auth',authRoutes);

// app.use('/api/tasks',TaskRoutes)
app.listen(5000, () => {
  console.log("Server running on port 5000")
})