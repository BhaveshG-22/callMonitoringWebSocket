const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

require("dotenv").config();

app.use(
  cors({
    origin: [
      "https://call-event-notifier.vercel.app",
      "https://call-event-display.vercel.app",
    ], // Allow specific origins
    methods: ["GET", "POST"],
  })
);

const PORT = process.env.PORT || 4101;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://call-event-notifier.vercel.app",
      "https://call-event-display.vercel.app",
    ], // Allow only these origins
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED BUT NOT JOINED ANY ROOM YET");

  socket.on("join", (data) => {
    socket.join(data);
    socket.emit("wsConnected", "true");
    console.log("USER CONNECTED IN ROOM", data);
  });

  socket.on("requestReceived", (data) => {
    console.log("Request Received --->", data);
    socket.to(data.room).emit("requestResponse", data.request); // Emit to room
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
