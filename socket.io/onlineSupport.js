module.exports = (io, socket) => {
  socket.on("support", (message) => {
    socket.emit("support", message);
  });
};
