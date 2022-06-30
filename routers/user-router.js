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
// 評論建立驗證
const commentScoretRules = [
  body("content").isLength({ min: 1 }).withMessage("請至少評論1個字以上"),
  body("score").isLength({ min: 1 }).withMessage("請給分數"),
];
// 內容更改驗證
const contentChangeRules = [
  body("content")
    .isLength({ min: 1 })
    .withMessage("請至少評論一個字以上(單純改評論)"),
];
// 分數更改驗證
const scoreChangeRules = [
  body("score")
    .isLength({ min: 1 })
    .withMessage("請請至少給出一點分數吧(單純只改分數)"),
];

// TODO 會員評論 READ 總數的頁碼
router.get("/comment/:user_id", async (req, res, next) => {
  // 1. 取得目前在第幾頁，而且利用 || 這個特性來做預設值
  let page = req.query.page || 1;
  console.log("current page", page);
  // 2. 取得目前總比數
  let [allResults, fields] = await pool.execute(
    "SELECT * FROM comment WHERE user_id = ?",
    [req.params.user_id]
  );
  // res.json(allResults);
  // console.log(allResults);
  const total = allResults.length;
  // 3. 計算總共有幾頁
  const perPage = 2;
  const lastPage = Math.ceil(total / perPage);
  // 4. 計算 offect 是多少(計算要跳過幾筆)
  let offect = (page - 1) * perPage;
  // 5. 取得一頁的資料
  let [pageResult] = await pool.execute(
    "SELECT product.name as product_name, product.price, user.full_name, comment.content, comment.score FROM comment, product, user WHERE user.id=comment.user_id AND comment.product_id=product.id AND user_id = ?  LIMIT ? OFFSET ?",
    [req.params.user_id, perPage, offect]
  );
  // 6. 回覆給前端的資料
  res.json({
    // 用來儲存所有跟頁碼有關的資訊
    pagination: {
      total,
      lastPage,
      page,
    },
    allResults: pageResult,
  });
});

// TODO 會員評論 CREATE
// TODO 評論(字數)&(分數)的驗證
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
// TODO 單改評論(字數)更新驗證
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

// TODO 喜好商品 READ & 喜好數量的頁碼
router.get("/favorite_product/:user_id", async (req, res, next) => {
  // 1. 取得目前在第幾頁 ， 且利用 || 這個特性來做預設值
  let page = req.query.page || 1;
  // 2. 取得目前的總比數
  let [allResults] = await pool.execute(
    "SELECT * FROM favorit_product WHERE user_id = ?",
    [req.params.user_id]
  );
  const total = allResults.length;
  // 3. 計算總空有幾頁
  const perPage = 2;
  const totalPage = Math.ceil(total / perPage);
  // 4. 計算offect 是多少(計算要跳過幾筆)
  let offset = (page - 1) * perPage;
  // 5. 取得這一頁的資料
  let [readDataFavoriteProduct] = await pool.execute(
    "SELECT * FROM favorit_product, product WHERE favorit_product.product_id=product.id AND user_id=? LIMIT ? OFFSET ?",
    [req.params.user_id, perPage, offset]
  );
  res.json({
    pagination: {
      total,
      totalPage,
      page,
    },
    allResults: readDataFavoriteProduct,
  });
});
// TODO 喜好商品 READ (沒有分頁只有全部的資料)
router.get("/favorite_product/all_data/:user_id", async (req, res, next) => {
  // 5. 取得這一頁的資料
  let [readDataFavoriteProduct] = await pool.execute(
    "SELECT * FROM favorit_product, product WHERE favorit_product.product_id=product.id AND user_id=? ",
    [req.params.user_id]
  );
  res.send(readDataFavoriteProduct);
});

// TODO 喜好商品 DELETE.
router.delete("/favorite_product/:id", async (req, res, next) => {
  let { id } = req.params;
  let { product_id } = req.body;
  let [deleteData] = await pool.execute(
    "DELETE FROM favorit_product WHERE user_id = ? AND product_id =?",
    [id, product_id]
  );
  res.send("你喜歡的商品已經刪除了喔");
});

// TODO 喜好商品 CREATE
router.post("/favorite_product", async (req, res, next) => {
  let { user_id, product_id } = req.body;
  let [inserData] = await pool.execute(
    "INSERT INTO favorit_product (user_id, product_id) VALUE (?,?) ",
    [user_id, product_id]
  );
  res.send(`會員 ${user_id} 您的喜愛商品 ${product_id} 已經更新囉`);
});

// TODO 會員課程
module.exports = router;
