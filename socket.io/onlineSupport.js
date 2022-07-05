const hashId = {};

module.exports = (io, socket) => {
  /* -------------------------------- user side ------------------------------- */
  socket.on("userConnect", (id) => {
    console.log("connect " + id);
    hashId[id] = socket.id;
    console.log(hashId);

    //回傳 message 給發送訊息的 Client
    socket.on("support", (res) => {
      // 傳給自己
      io.to(hashId[res.id]).emit("support", res);
      // 傳給伺服器
      io.to(hashId[res["official"]]).emit("support", res);
    });
    //離開事件
    socket.once("disconnect", (msg, a) => {
      delete hashId[id];
      console.log(hashId);
    });
  });
  /* ------------------------------ official side ----------------------------- */
  socket.on("officialConnect", () => {
    //回傳 message 給發送訊息的 Client
    console.log("event:officialConnect ");
    hashId.official = socket.id;
    console.log(hashId);

    socket.on("support", (res) => {
      // 傳給客戶
      io.to(hashId[res.id]).emit("support", res);
      // 傳給自己
      io.to(hashId[res["official"]]).emit("support", res);
    });

    socket.on("userConnect", (client) => {
      const list = Object.keys(hashId).filter((key) => key !== "official");
      io.to(hashId[res["official"]]).emit("clientList", list);
    });

    //離開事件
    socket.once("disconnect", (msg, a) => {
      delete hashId[id];
      console.log(hashId);
    });
  });
};
