require("dotenv").config();
const fs = require("node:fs");
const mongoose = require("mongoose");
const connectDB = require("../src/db/db");
const Task = require("../src/models/TaskModel");

async function backupTasks() {
  try {
    await connectDB();
    const tasks = await Task.collection.find({}).toArray();
    fs.writeFileSync(
      "tasks-backup.json",
      JSON.stringify(tasks, null, 2)
    );
    console.log(`Backed up ${tasks.length} tasks`);
  } catch (error) {
    console.error("Backup failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}
backupTasks();
// How it works: Task.collection.find({}).toArray() 
// reads all existing task documents directly from 
// MongoDB. JSON.stringify() converts them into JSON, 
// and fs.writeFileSync() saves them in a file.
//  The script doesn't change your Atlas data.