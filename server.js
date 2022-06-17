const express = require("express");
const app = express();
const cors = require("cors");
const uuid = require("uuid");
const {
  authRouter,
  userRouter,
  productRouter,
  lessonRouter,
  couponRouter,
} = require("./routers");
const pool = require("./utils/dbConnect");
require("dotenv").config();

// NOTE socketio
const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 取得 client 連線數量
// const count = io.engine.clientsCount;

// 設定標頭 (一個用戶一次)
// io.engine.on("initial_headers", (headers, req) => {
//   headers["test"] = "123";
//   headers["set-cookie"] = "mycookie=456";
// });

// 設定每個標頭
// io.engine.on("initial_headers", (headers, req) => {
//   headers["test"] = "123";
//   headers["set-cookie"] = "mycookie=456";
// });

// catch error
io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

// socketsJoin: makes the matching socket instances join the specified rooms
// 加入指定房間
// ̀socketsLeave: makes the matching socket instances leave the specified rooms
// 離開指定房間
// disconnectSockets: makes the matching socket instances disconnect
// 斷開連線
// fetchSockets: returns the matching socket instances
// 取得目前client

io.on("connection", (socket) => {
  // ...
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
//解析body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 啟用 session
const expressSession = require("express-session");
app.use(
  expressSession({ secret: "test", resave: false, saveUninitialized: false })
);

//bodyparser
app.use(express.urlencoded({ extends: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("sweteen server");
});

// NOTE routers

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/coupon", couponRouter);

// NOTE 404
app.use("/*", (req, res, next) => {
  console.log("所有路由的後面 ==> 404", req.path);
  res.status(404).send("Not Found");
});

httpServer.listen(process.env.SERVER_PORT || 8001, () =>
  console.log("server running on " + process.env.SERVER_PORT)
);

// const server = app.listen(process.env.SERVER_PORT || 8001, () => {
//   console.log(`sweeten server is running on ${process.env.SERVER_PORT}`);
// });
