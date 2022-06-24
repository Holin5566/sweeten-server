const express = require("express");
const app = express();
const cors = require("cors");
const {
  authRouter,
  userRouter,
  productRouter,
  lessonRouter,
  couponRouter,
  orderRouter,
  setFakeData,
  ecpayRouter,
} = require("./routers");
const pool = require("./utils/dbConnect");
require("dotenv").config();

// NOTE 連接 socketio
const { Server } = require("socket.io");
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
require("./socket.io")(io);

// NOTE cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// NOTE bady parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// NOTE 啟用 session
const expressSession = require("express-session");
app.use(
  expressSession({ secret: "test", resave: false, saveUninitialized: false })
);

app.get("/", (req, res) => {
  console.log("open server");
  res.send("sweteen server");
});

// NOTE routers

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/order", orderRouter);
// ----------------------------------------
app.use("/setfakedata", setFakeData);
app.use("/api/ecpay", ecpayRouter);

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
