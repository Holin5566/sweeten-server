const express = require("express");
const router = express.Router();
require("dotenv").config();

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming userRouter");
  next();
});
// TODO 讀取出會員已經寫好的評論
//[完成]
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

// TODO 會員評論 新增
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

// TODO 會員評論刪除
router.delete("comment/:id", async (req, res, next) => {
  let { id } = req.params;
  let [deleteData] = await pool.execute("DELETE FROM comment WHERE id=?", [id]);
  console.log("Delete Data: ", deleteData);
  res.send(`你已成功刪除了會員 ID: ${id} 的資料`);
});

// TODO 會員評論更新
router.patch("comment/:id", async (req, res, next) => {
  let { id } = req.params;
  let [totalData] = await pool.execute("SELECT * FROM comment WHERE id = ?", [
    id,
  ]);
  console.log(totalData);
  let { product_id, content, score } = req.body;

  if (totalData.product_id !== product_id && totalData.content !== content) {
    let produtcData = await pool.execute("UPDATE comment SET product");
  }

  // console.log("Patch Data: ", patchData);
  res.send("您的評論已經更新了喔");
});

// TODO 會員編輯
// TODO 喜好 CRUD
// TODO 評論 CRUD
// TODO 評分 RU

module.exports = router;
