module.exports = (socket) => {
  socket.on("support", (message) => {
    console.log("socket.io on support");
    logger.log("info", message.value);
    socket.emit("ditConsumer", message.value);
    console.log("from console", message.value);
  });
};
