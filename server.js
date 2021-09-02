const express = require("express");
const path = require("path");
const http = require("http");
const socketiO = require("socket.io");
const formateMessage = require("./messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketiO(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));
const botName = "Admin";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //welcome message
    socket.emit("message", formateMessage(botName, "Welcom to chat room!"));

    // Brodcast when client connects
    socket.broadcast
      .to(user.room)
      .emit("message", formateMessage(botName, `${user.username} joined`));

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formateMessage(user.username, msg));
    // console.log(msg);
  });

  //  Run when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formateMessage(botName, `${user.username} has left`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }

    // io.emit("message", formateMessage(botName, "A user has left"));
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
