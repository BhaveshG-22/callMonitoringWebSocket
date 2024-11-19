const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const WS_ALLOWED_ORIGINS = process.env.WS_ALLOWED_ORIGINS.split(",");
console.log(WS_ALLOWED_ORIGINS);
const PORT = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: WS_ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data); //newly connected connection joining a room
  });

  socket.on("requestReceived", (data) => {
    socket.to(data.room).emit("requestResponse", data.request);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

server.listen(PORT | 4101, () => {
  console.log(`Server Started`);
});
