const express = require("express");
const router = express.Router();
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming userRouter");
  next();
});

// TODO 會員編輯
// TODO 喜好 CRUD
// TODO 評論 CRUD
// TODO 評分 RU

module.exports = router;
