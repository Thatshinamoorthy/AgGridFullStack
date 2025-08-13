const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const users = require("./Models/userSchema.js");

app.use(express.json({ limit: "2mb" }));
const server = http.createServer(app);
const socketIO = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const usersSocket = socketIO.of("/users");

usersSocket.on("connection", (socket) => {
  socket.on("get-row", async (data, callback) => {
    try {
      const start = data?.startRow || 0;
      const end = data?.endRow || 100;
      const userData = await users
        .find({})
        .skip(start)
        .limit(end - start);
      const total = await users.countDocuments();
      callback({ userData, total });
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("add-user", async (data, callback) => {
    try {
      const { id, name, age, std, gender, school_name } = data;
      if (!id || !name || !age || !std || !gender || !school_name) {
        return callback({ success: false, error: "Please fill all fields" });
      }
      const existUser = await users.findOne({ id });
      if (existUser) {
        callback({ success: false, error: "User already exist" });
        return;
      }
      const user = await users.create(data);
      callback({
        success: true,
        message: "User Added Successfully!",
        data: user,
      });
      usersSocket.emit("user-added", {
        success: true,
        message: "User Added Successfully!",
        data: user,
      });
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("edit-user", async (data, callback) => {
    try {
      const { id } = data;
      if (!id) {
        callback({ success: false, error: "User id is required" });
        return;
      }
      const existUser = await users.findOne({ id });
      if (!existUser) {
        callback({ success: false, error: "User not found" });
        return;
      }
      if (existUser) {
        await users.updateOne({ id }, { $set: data });
        callback({
          success: true,
          message: "User Updated Successfully!",
          data: data,
        });
        usersSocket.emit("user-updated", {
          success: true,
          message: "User Updated Successfully!",
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("del-user", async (data, callback) => {
    try {
      const { id } = data;
      if (!id) {
        callback({ success: false, error: "User id is required" });
        return;
      }
      const existUser = await users.findOne({ id });
      if (!existUser) {
        callback({ success: false, error: "User not found" });
        return;
      }
      if (existUser) {
        const user = await users.deleteOne({ id });
        callback({
          success: true,
          message: "User Deleted Successfully!",
          data: user,
        });
        usersSocket.emit("user-deleted", {
          success: true,
          message: "User Deleted Successfully!",
          data: user,
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
});

module.exports = server;
