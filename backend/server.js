require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB= require("./src/db/db");

const app = express();
connectDB()
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.listen(5000, () => {
  console.log("Server running on port 5000");
});