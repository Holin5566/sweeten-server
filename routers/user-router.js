const express = require("express");
const router = express.Router();
require("dotenv").config();

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming userRouter");
  next();
});
// TODO 會員評論 READ
router.get("/comment/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    let [commentData] = await pool.execute("SELECT * FROM comment WHERE id=?", [
      id,
    ]);
    res.send(commentData);
  } catch (e) {
    res.send(e);
  }
});

// TODO 會員評論 CREATE
router.post("/comment", async (req, res, next) => {
  let created_at = new Date();
  let { id, user_id, product_id, content, score } = req.body;
  let [insertData] = await pool.execute(
    "INSERT INTO comment (id, user_id, product_id, content, score, created_at) VALUE (?, ?, ?, ?, ?, ?)",
    [id, user_id, product_id, content, score, created_at]
  );
  console.log("New Comment Data:", insertData);
  res.send("謝謝你的評論");
});

// TODO 會員評論 DELETE
router.delete("/comment/:id", async (req, res, next) => {
  let { id } = req.params;
  let [deleteData] = await pool.execute("DELETE FROM comment WHERE id=?", [id]);
  console.log("Delete Data: ", deleteData);
  res.send(`你已成功刪除了會員 ID: ${id} 的資料`);
});

// TODO 會員評論 UPDATE
router.patch("/comment/:id", async (req, res, next) => {
  let { id } = req.params;
  let { content } = req.body;
  let [insertDataContent] = await pool.execute(
    "UPDATE comment SET content=? WHERE id=?",
    [content, id]
  );
  console.log("Insert Data: ", insertDataContent);
  res.send(`會員您的評論內容以更新`);
});

// TODO 評分 READ
router.get("/score/:id", async (req, res, next) => {
  let { id } = req.params;
  let { score } = req.body;
  let [insertDataScore] = await pool.execute(
    "SELECT score FROM comment WHERE id=?",
    [id]
  );
  res.send(insertDataScore);
});

// TODO 評分 UPDATE
router.patch("/score/:id", async (req, res, next) => {
  let { id } = req.params;
  let { score } = req.body;
  let [updateDataScore] = await pool.execute(
    "UPDATE comment SET score=? WHERE id=?",
    [score, id]
  );
  console.log(updateDataScore);
  res.send("您的評分已經更新了喔");
});

// TODO 喜好 READ
router.get("/favorite_product/:id", async (req, res, next) => {
  let { id } = req.params;
  let { product_id } = req.body;
  let [readDataFavoriteProduct] = await pool.execute(
    "SELECT * FROM favorit_product WHERE user_id=?",
    [id]
  );
  res.send(readDataFavoriteProduct);
});

// TODO 喜好 DELETE
router.delete("/favorite_product/:id", async (req, res, next) => {
  let { id } = req.params;
  let { product_id } = req.body;
  let [deleteData] = await pool.execute(
    "DELETE FROM favorit_product WHERE user_id = ? AND product_id =?",
    [id, product_id]
  );
  res.send("你喜歡的商品已經刪除了喔");
});

// TODO 喜好 CREATE
router.post("/favorite_product", async (req, res, next) => {
  let { user_id, product_id } = req.body;
  let [inserData] = await pool.execute(
    "INSERT INTO favorit_product (user_id, product_id) VALUE (?,?) ",
    [user_id, product_id]
  );
  res.send(`會員 ${user_id} 您的喜愛商品 ${product_id} 已經更新囉`);
});

module.exports = router;
