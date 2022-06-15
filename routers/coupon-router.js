const express = require("express");
const router = express.Router();
require("dotenv").config();

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming couponRouter");
  next();
});

// TODO 酷碰 CRUD
// Read coupon (所有庫碰)
router.get("/", async (req, res, next) => {
  try {
    let [coupons] = await pool.execute("SELECT * FROM coupon");
    res.send(coupons);
  } catch (e) {
    res.send(e);
  }
});

// TODO 評論 CRUD
// TODO 評分 RU

module.exports = router;
