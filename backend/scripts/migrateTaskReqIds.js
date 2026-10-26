require("dotenv").config();

const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");

const connectDB = require("../src/db/db");
const Task = require("../src/models/TaskModel");

const migrate = async () => {
  try {
    await connectDB();

    console.log("Database:", mongoose.connection.name);

    const filter = {
      $or: [
        { reqId: { $exists: false } },
        { reqId: null },
        { reqId: "" }
      ]
    };

    const count = await Task.countDocuments(filter);
    console.log("Tasks needing migration:", count);

    // Safety: preview only until backup is confirmed
    if (process.env.RUN_MIGRATION !== "true") {
      console.log("Preview complete. No tasks changed.");
      return;
    }

    const tasks = await Task.find(filter).select("_id").lean();
    let updated = 0;

    for (const task of tasks) {
      const result = await Task.updateOne(
        { _id: task._id, ...filter },
        { $set: { reqId: randomUUID() } }
      );

      updated += result.modifiedCount;
    }

    console.log("Tasks updated:", updated);
    console.log("Remaining:", await Task.countDocuments(filter));
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

migrate();