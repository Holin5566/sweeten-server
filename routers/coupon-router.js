const express = require("express");
const router = express.Router();
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming couponRouter");
  next();
});

module.exports = router;
