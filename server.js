const express = require("express");
const app = express();
const cors = require("cors");
const { authRouter, userRouter } = require("./routers");
const pool = require("./utils/dbConnect");
require("dotenv").config();

app.use(cors());

app.get("/", (req, res) => {
  res.send("sweteen server");
});

// NOTE routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// NOTE 404
app.use((req, res, next) => {
  console.log("所有路由的後面 ==> 404", req.path);
  res.status(404).send("Not Found");
});

app.listen(process.env.SERVER_PORT || 8001, () => {
  console.log(`sweeten server is running on ${process.env.SERVER_PORT}`);
});
