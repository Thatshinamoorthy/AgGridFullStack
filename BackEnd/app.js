const express = require("express");
const app = express();
const http = require("http");
const {Server} = require('socket.io');
const users = require('./Models/userSchema.js');

const server = http.createServer(app);
const socketIO =new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const usersSocket = socketIO.of("/users");

usersSocket.on("connection",(socket)=>{
    socket.on('get-row',async (data,callback)=>{
        const start = data?.startRow||0;
        const end = data?.endRow||100;
        const userData = await users.find({}).skip(start).limit(end-start);
        const total = await users.countDocuments();
        callback({userData,total});
    })
})

module.exports = server;