const express = require("express");
const router = express.Router();
require("dotenv").config();

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming orderRouter");
  next();
});

// TODO 訂單 CRUD
// [完成] Read order (所有訂單)
router.get("/", async (req, res, next) => {
  try {
    const [allOrder] = await pool.execute("SELECT * FROM order_info");
    res.send(allOrder);
  } catch (e) {
    res.status(404).send(e);
  }
});

// [完成] Read order (個人所有訂單)
router.get("/user/:user_id", async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const [order] = await pool.execute(
      "SELECT * FROM order_info WHERE user_id = ?",
      [user_id]
    );
    res.send(order);
  } catch (e) {
    res.status(404).send(e);
  }
});

// Read order (個別訂單)
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [order] = await pool.execute(
      "SELECT * FROM order_info WHERE id = ?",
      [id]
    );
    res.send(order);
  } catch (e) {
    res.status(404).send(e);
  }
});

// [完成] Create order
router.post("/", async (req, res, next) => {
  const { user_id, coupon_id, order_status_id } = req.body;
  // console.log(user_id, coupon_id, order_status_id)
  try {
    let [newOrder] = await pool.execute(
      "INSERT INTO order_info (user_id, coupon_id, order_status_id) VALUES (?, ?, ?)",
      [user_id, coupon_id, order_status_id]
    );
    res.send("新增訂單成功");
  } catch (e) {
    res.status(404).send(e);
  }
});

// [完成] Update order (取消訂單)
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [deleteOrder] = await pool.execute(
      "UPDATE order_info SET order_status_id = ? WHERE id = ?",
      ["5", id]
    );
    res.send("取消訂單成功");
  } catch (e) {
    res.status(404).send(e);
  }
});

// TODO 進度條 CRUD
// [完成] Update order status
router.patch("/status/:id", async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [updateOrderStatus] = await pool.execute(
      "UPDATE order_info SET order_status_id = ? WHERE id = ?",
      [status, id]
    );
    res.send("成功更新訂單狀態");
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
