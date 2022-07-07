const hashId = {};
module.exports = (io, socket) => {
  socket.on("support", (message) => {
    io.emit("support", message);
  });
};
