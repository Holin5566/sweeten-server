const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const {
  authRouter,
  userRouter,
  productRouter,
  lessonRouter,
  couponRouter,
  orderRouter,
  setFakeData,
  ecpayRouter,
  expiryRouter,
} = require("./routers");
// const pool = require("./utils/dbConnect");
require("dotenv").config();

/* --------------------------- socketio -------------------------- */
const { Server } = require("socket.io");
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
require("./socket.io")(io);

/* ------------------------------  cors ------------------------------ */
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

/* ---------------------------  啟用 session --------------------------- */
const expressSession = require("express-session");
const FileStore = require("session-file-store")(expressSession);
const path = require("path");
const sessionStore = new FileStore({
  path: path.join(__dirname, "..", "sessions"),
});
app.use(
  expressSession({
    store: sessionStore,
    secret: "test",
    resave: false,
    saveUninitialized: false,
  })
);
// const cookieSession = require("cookie-session");
// app.use(
//   cookieSession({
//     keys: ["secret"],
//   })
// );
app.use(passport.initialize());
app.use(passport.session());

/* ---------------------------  bady parser -------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -----------------------------  routers ---------------------------- */
app.get("/", (req, res) => {
  console.log("open server");
  res.send("sweteen server");
});

// NOTE routers

app.use("/public", express.static("public"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/order", orderRouter);
app.use("/api/expiry", expiryRouter);
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
