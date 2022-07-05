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
    // 沒有頁碼的情況
    // const [allOrder] = await pool.execute("SELECT * FROM order_info");

    // 取得目前頁數
    const page = req.query.page;

    // 取的所有資料筆數
    // const [order] = await pool.execute("SELECT * FROM order_info");
    const [order] = await pool.execute(
      "SELECT order_product.*, order_info.user_id, order_info.order_status_id, order_info.address, order_info.payment_id, order_info.timestamp FROM order_product, order_info WHERE order_info_id = order_info.id"
    );
    const totalResults = order.length;
    // console.log(totalResults);

    // 取得所有頁數
    const perPage = 5;
    const totalPage = Math.ceil(totalResults / perPage);
    // console.log(totalPage);

    // 計算要跳過幾筆
    const offset = (page - 1) * perPage;
    // console.log(offset);
    // const [pageResult] = await pool.execute(
    //   "SELECT * FROM order_info ORDER BY timestamp DESC LIMIT ? OFFSET ?",
    //   [perPage, offset]
    // );
    const [pageResult] = await pool.execute(
      `SELECT order_product.*, order_info.user_id, order_info.order_status_id, order_info.address, order_info.payment_id, order_info.timestamp 
      FROM order_product, order_info 
      WHERE order_info_id = order_info.id 
      ORDER BY timestamp DESC 
      LIMIT ? OFFSET ?`,
      [perPage, offset]
    );

    // 回覆前端
    if (pageResult.length === 0) {
      res.status(404).json(pageResult);
    } else {
      res.json({
        pagination: {
          totalResults,
          totalPage,
          page,
        },
        data: pageResult,
      });
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

// FIXME order 要修正 sql 語法

// [完成] Read order (個人所有訂單)
router.get("/user/:user_id", async (req, res, next) => {
  const { user_id } = req.params;
  try {
    // 沒有頁碼的情況
    // const [order] = await pool.execute(
    //   "SELECT * FROM order_info WHERE user_id = ?",
    //   [user_id]
    // );

    // 取得目前在第幾頁
    // const page = req.query.page || 1;
    // console.log(page)

    // 取得總資料筆數
    // const [personalOrder] = await pool.execute(
    //   "SELECT * FROM order_info WHERE user_id = ?",
    //   [user_id]
    // );
    // const [personalOrder] = await pool.execute(
    //   `SELECT order_product.*, order_info.user_id, order_info.order_status_id, order_info.address, order_info.payment_id, order_info.timestamp, product.name
    //   FROM order_product, order_info, product
    //   WHERE order_info_id = order_info.id AND order_product.product_id = product.id AND user_id = ?`,
    //   [user_id]
    // );
    // const totalResults = personalOrder.length;
    // console.log(totalResults)

    // 取得總頁數
    // const perPage = 5;
    // const totalPage = Math.ceil(totalResults / perPage);
    // console.log(totalPage)

    // 計算要跳過的筆數
    // const offset = (page - 1) * perPage;
    // console.log(offset);

    // 取得這一頁的資料
    // const [pageResult] = await pool.execute(
    //   "SELECT * FROM order_info WHERE user_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?",
    //   [user_id, perPage, offset]
    // );
    // const [pageResult] = await pool.execute(
    //   `SELECT order_product.*, order_info.user_id, order_info.order_status_id, order_info.address, order_info.payment_id, order_info.timestamp, product.name
    //   FROM order_product, order_info, product
    //   WHERE order_info_id = order_info.id AND order_product.product_id = product.id AND user_id = ?
    //   ORDER BY timestamp DESC
    //   LIMIT ? OFFSET ?`,
    //   [user_id, perPage, offset]
    // );
    const [orderResult] = await pool.execute(
      `SELECT order_product.*, order_info.user_id, order_info.order_status_id, order_info.address, order_info.payment_id, order_info.timestamp, product.name 
      FROM order_product, order_info, product
      WHERE order_info_id = order_info.id AND order_product.product_id = product.id AND user_id = ? 
      ORDER BY timestamp DESC `,
      [user_id]
    );

    // 回覆給前端
    if (orderResult.length === 0) {
      res.status(404).json(orderResult);
    } else {
      res.json({
        data: orderResult,
      });
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

// Read order (個別訂單)
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    // const [order] = await pool.execute(
    //   "SELECT * FROM order_info WHERE id = ?",
    //   [id]
    // );
    const [order] = await pool.execute(
      `SELECT order_product.*, order_info.user_id, order_info.order_status_id, order_info.address, order_info.payment_id, order_info.timestamp 
      FROM order_product, order_info 
      WHERE order_info_id = order_info.id AND order_info.id = ?`,
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
