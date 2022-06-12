const express = require("express");
const router = express.Router();
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming lessonRouter");
  next();
});

// TODO 課程 CRUD
// TODO 評論 CRUD
// TODO 評分 RU

module.exports = router;
