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
// [完成] Read coupon (所有酷碰)
router.get("/", async (req, res, next) => {
  try {
    let [coupons] = await pool.execute("SELECT * FROM coupon");
    res.send(coupons);
  } catch (e) {
    res.send(e);
  }
});

// [完成] Read coupon (各別酷碰)
router.get("/:id", async (req, res, next) => {
  let { id } = req.params;
  try {
    let [coupon] = await pool.execute("SELECT * FROM coupon WHERE id = ?", [
      id,
    ]);
    res.send(coupon);
  } catch (e) {
    res.send(e);
  }
});

// [完成] Create coupon
router.post("/", async (req, res, next) => {
  let { name, code, discount, start_date, end_date, limited } = req.body;
  let [insertCoupon] = await pool.execute(
    "INSERT INTO coupon (name, code, discount, start_date, end_date, limited) VALUES (?, ?, ?, ?, ?, ?)",
    [name, code, discount, start_date, end_date, limited]
  );
  res.send(insertCoupon);
});

// Update coupon

// [完成] Delete coupon
router.delete("/:id", async (req, res, next) => {
  let { id } = req.params;
  let [deleteCoupon] = await pool.execute("DELETE FROM coupon WHERE id = ?", [
    id,
  ]);
  res.send("The coupon has been deleted");
});

module.exports = router;
