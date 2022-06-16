const express = require("express");
const app = express();
const cors = require("cors");
const {
  authRouter,
  userRouter,
  productRouter,
  lessonRouter,
  couponRouter,
} = require("./routers");
const pool = require("./utils/dbConnect");
require("dotenv").config();

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

app.listen(process.env.SERVER_PORT || 8001, () => {
  console.log(`sweeten server is running on ${process.env.SERVER_PORT}`);
});
