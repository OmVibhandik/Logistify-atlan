const socketIo = require("socket.io");

const setupWebSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*", // Adjust according to your front-end URL
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected with socket id:", socket.id);

    socket.on("joinRoom", ({ room }) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on("locationUpdate", ({ room, location }) => {
      // Broadcast location to all clients in the room except the sender
      socket.to(room).emit("receiveLocation", location);
    });

    socket.on("statusUpdate", ({ bookingId, status }) => {
      // This is a broad emit, would typically require more controlled handling
      io.emit("bookingStatusChanged", { bookingId, status });
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  return io;
};

module.exports = setupWebSocket;
