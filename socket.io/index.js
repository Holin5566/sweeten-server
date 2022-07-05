module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connect socketio");
    require("./onlineSupport")(io, socket);
  });
};

// 取得 client 連線數量
// const count = io.engine.clientsCount;

// 設定標頭 (一個用戶一次)
// io.engine.on("initial_headers", (headers, req) => {
//   headers["test"] = "123";
//   headers["set-cookie"] = "mycookie=456";
// });

// 設定每次 req 標頭
// io.engine.on("initial_headers", (headers, req) => {
//   headers["test"] = "123";
//   headers["set-cookie"] = "mycookie=456";
// });

// catch error
// io.engine.on("connection_error", (err) => {
//   console.log(err.req); // the request object
//   console.log(err.code); // the error code, for example 1
//   console.log(err.message); // the error message, for example "Session ID unknown"
//   console.log(err.context); // some additional error context
// });

// io.on("connection", (socket) => {
//   console.log("connect");
// });

// socketsJoin: makes the matching socket instances join the specified rooms
// 加入指定房間
// ̀socketsLeave: makes the matching socket instances leave the specified rooms
// 離開指定房間
// disconnectSockets: makes the matching socket instances disconnect
// 斷開連線
// fetchSockets: returns the matching socket instances
// 取得目前client
