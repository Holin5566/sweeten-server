const express = require("express");
const router = express.Router();
require("dotenv").config();

//表單驗證用套件
const { body, validationResult } = require("express-validator");

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming userRouter");
  next();
});
// 資料驗證要使用的東西
const commentScoretRules = [
  body("content").isLength({ min: 1 }).withMessage("請至少評論1個字以上"),
  body("score").isLength({ min: 1 }).withMessage("請給分數"),
];
const contentChangeRules = [
  body("content")
    .isLength({ min: 1 })
    .withMessage("請至少評論一個字以上(單純改評論)"),
];
const scoreChangeRules = [
  body("score")
    .isLength({ min: 1 })
    .withMessage("請請至少給出一點分數吧(單純只改分數)"),
];

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
// TODO 評論(字數)&(分數)的驗證-----------(v)
router.post("/comment", commentScoretRules, async (req, res, next) => {
  let created_at = new Date();
  let { id, user_id, product_id, content, score } = req.body;
  //拿出經過驗證後的結果
  const validateResults = validationResult(req);
  if (!validateResults.isEmpty()) {
    let error = validateResults.array();
    return res.status(400).json({ code: 3001, error: error });
  }
  let [insertData] = await pool.execute(
    "INSERT INTO comment (id, user_id, product_id, content, score, created_at) VALUE (?, ?, ?, ?, ?, ?)",
    [id, user_id, product_id, content, score, created_at]
  );
  console.log("New Comment Data:", insertData);
  res.json("謝謝你的評論");
});

// TODO 會員評論 DELETE
router.delete("/comment/:id", async (req, res, next) => {
  let { id } = req.params;
  let [deleteData] = await pool.execute("DELETE FROM comment WHERE id=?", [id]);
  console.log("Delete Data: ", deleteData);
  res.send(`你已成功刪除了會員 ID: ${id} 的資料`);
});

// TODO 評論 UPDATE
// TODO 單改評論(字數)更新驗證----------------(v)
router.patch("/comment/:id", contentChangeRules, async (req, res, next) => {
  let { id } = req.params;
  let { content } = req.body;
  //拿出驗證後的結果
  const contentResults = validationResult(req);
  //下判斷如果拿到的結果不是空的話
  if (!contentResults.isEmpty()) {
    let error = contentResults.array();
    return res.status(400).json({ code: 789456, error: error });
  }
  let [insertDataContent] = await pool.execute(
    "UPDATE comment SET content=? WHERE id=?",
    [content, id]
  );
  console.log("Insert Data: ", insertDataContent);
  res.json(`會員您的評論內容以更新`);
});

// TODO 評分 UPDATE
// TODO 單改評分(分數)的驗證
router.patch("/score/:id", scoreChangeRules, async (req, res, next) => {
  let { id } = req.params;
  let { score } = req.body;
  //拿出驗證後的結果
  const scoreResult = validationResult(req);
  //下判判斷
  if (!scoreResult.isEmpty()) {
    let error = scoreResult.array();
    return res.status(400).json({ code: "客戶的評論沒打分數拉", error: error });
  }
  let [updateDataScore] = await pool.execute(
    "UPDATE comment SET score=? WHERE id=?",
    [score, id]
  );
  //這個是呈現在哪裡的資料???
  console.log(updateDataScore);
  res.send("您的評分已經更新了喔");
});

// TODO 評分 READ
router.get("/score/:id", async (req, res, next) => {
  let { id } = req.params;
  let { score } = req.body;
  try {
    let [insertDataScore] = await pool.execute(
      "SELECT score FROM comment WHERE id=?",
      [id]
    );
    res.send(insertDataScore);
  } catch (e) {
    res.send("沒有這個評論拉");
  }
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
