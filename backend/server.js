require("dotenv").config();
const express = require("express");

const app = express ();
const connectDB=require("./src/config/config.js");
const cookieParser = require("cookie-parser");
connectDB()
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CareerOS backend is connected"
  });
});


app.post()
app.listen(3000,()=>{
    console.log("Server is running at port 3000");
});

