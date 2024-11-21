const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const WS_ALLOWED_ORIGINS = process.env.WS_ALLOWED_ORIGINS.split(",");
const PORT = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED BUT NOT JOINED ANY ROOM YET ");

  socket.on("join", (data) => {
    socket.join(data);  
    socket.emit("wsConnected", "true");
    console.log("USER CONNECTED IN ROOM ", data);
  });

  socket.on("requestReceived", (data) => {
    console.log("Request Received--->", data);

     socket.to(data.room).emit("requestResponse", data.request);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

server.listen(PORT || 4101, () => {
  console.log(`Server Started`);
});
