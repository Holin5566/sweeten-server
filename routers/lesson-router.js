const express = require("express");
const router = express.Router();
require("dotenv").config();

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming lessonRouter");
  next();
});

// TODO 課程 CRUD
// [完成] 課程 Read (所有課程)
router.get("/", async (req, res, next) => {
  try {
    const [allLesson] = await pool.execute("SELECT * FROM lesson");
    res.send(allLesson);
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// [完成] 課程 Read (個別課程)
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const [lessonData] = await pool.execute(
      "SELECT * FROM lesson WHERE id = ?",
      [id]
    );
    res.send(lessonData);
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// [完成] 課程 Create
router.post("/", async (req, res, next) => {
  // res.send(req.body);
  const { name, price, description, start_date, duration } = req.body;

  try {
    const [insertLesson] = await pool.execute(
      "INSERT INTO lesson (name, price, description, start_date, duration) VALUES(?, ?, ?, ?, ?)",
      [name, price, description, start_date, duration]
    );
    res.send("The new lesson has been launched.");
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// [完成] 課程 Update
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const newLesson = req.body;

  const [preLessonSql] = await pool.execute(
    "SELECT * FROM lesson WHERE id = ?",
    [id]
  );

  let sql = "";
  let sqlPreparedArr = [];

  for (let key in preLessonSql[0]) {
    console.log(key);
    if (newLesson[key]) {
      sql += key + " = ?, ";
      sqlPreparedArr.push(newLesson[key]);
    }
  }
  // console.log(sql);
  // console.log(sqlPreparedArr);

  sql = "UPDATE lesson SET " + sql.slice(0, -2) + " WHERE id = ?";
  // console.log(sql)
  sqlPreparedArr.push(`${id}`);
  // console.log(sqlPreparedArr);

  try {
    let [updatedLesson] = await pool.execute(sql, sqlPreparedArr);
    res.send("The lesson has been updated.");
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// [完成] 課程 Delete
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const [deleteLesson] = await pool.execute(
      "DELETE FROM lesson WHERE id = ?",
      [id]
    );
    res.send("The lesson has been deleted.");
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// TODO 評論 CRUD
// [完成] 課程評論 Read (個別課程評論)
router.get("/comment/:product_id", async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const [allLessonComment] = await pool.execute(
      "SELECT * FROM comment WHERE product_id = ?",
      [product_id]
    );
    res.send(allLessonComment);
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// [完成] 課程評論 Create
router.post("/comment", async (req, res, next) => {
  let { user_id, product_id, content, score } = req.body;
  let created_at = new Date();

  let [createLessonComment] = await pool.execute(
    "INSERT INTO comment ( user_id, product_id, content, score, created_at) VALUES (?, ?, ?, ?, ?)",
    [user_id, product_id, content, score, created_at]
  );
  console.log(createLessonComment);
  res.send("新增評論成功");
});

// [完成] 課程評論 Update
router.patch("/comment/:product_id", async (req, res, next) => {
  const { product_id } = req.params;
  const { content } = req.body;

  try {
    const [updatedLessonComment] = await pool.execute(
      "UPDATE comment SET content = ? WHERE product_id = ?",
      [content, product_id]
    );
    res.send("Comment has been updated successfully.");
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// [完成] 課程評論 Delete
router.delete("/comment/:product_id", async (req, res, next) => {
  let { product_id } = req.params;

  try {
    let [deletedProductComment] = await pool.execute(
      "DELETE FROM comment WHERE id = ?",
      [product_id]
    );
    res.send("The comment has been deleted.");
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// TODO 評分 RU
// [完成] 課程評分 Read (個別課程評分)
router.get("/score/:product_id", async (req, res, next) => {
  const { product_id } = req.params;

  try {
    const [allLessonComment] = await pool.execute(
      "SELECT score, product_id FROM comment WHERE product_id = ?",
      [product_id]
    );
    res.send(allLessonComment);
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

// [完成] 課程評分 Update
router.patch("/score/:product_id", async (req, res, next) => {
  const { product_id } = req.params;
  const { score } = req.body;

  try {
    const [updatedLessonComment] = await pool.execute(
      "UPDATE comment SET score = ? WHERE product_id = ?",
      [score, product_id]
    );
    res.send("Score has been updated successfully.");
  } catch (e) {
    res.status(404);
    res.send(e);
  }
});

module.exports = router;
