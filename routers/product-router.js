const express = require("express");
const { app } = require("firebase-admin");
const router = express.Router();
const { uuid } = require("uuidv4");
require("dotenv").config();

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming from productRouter");
  next();
});

// TODO 商品 CRUD
// 完成 從 product 資料表 Read 資料
router.get("/:id", async (req, res, next) => {
  try {
    let [product] = await pool.execute("SELECT * FROM product WHERE id = ?", [
      req.params.id,
    ]);
    res.send(product);
    console.log(new Date());
  } catch (e) {
    res.send(e);
  }
});

// Create
router.post("/create", async (req, res, next) => {
  let { name, price, description, express_id, address, payment } = req.body;

  // 時區要看一下
  // INSERT INTO `product` (`id`, `name`, `price`, `description`, `express_id`, `address`, `payment`, `created_at`) VALUES ('2', '蛋糕2號', '1500', '好好吃', '2', '嘉義', '信用卡', '20220614');
});

// Uudate

// Delete
router.delete("/delete/:id", (req, res, next) => {
  res.send("The product has been deleted");
});

// TODO 評論 CRUD
// TODO 評分 RU

module.exports = router;
