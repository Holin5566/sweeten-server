const express = require("express");
const { app } = require("firebase-admin");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { empty } = require("uuidv4");
require("dotenv").config();

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming from productRouter");
  next();
});

// TODO 商品 CRUD
// [完成] Read Product (所有產品)
router.get("/", async (req, res, next) => {
  try {
    let [products] = await pool.execute("SELECT * FROM product");
    res.send(products);
  } catch (e) {
    res.send(e);
  }
});

// [完成] Read Product (個別產品)
router.get("/:id", async (req, res, next) => {
  try {
    let [product] = await pool.execute("SELECT * FROM product WHERE id = ?", [
      req.params.id,
    ]);
    res.send(product);
  } catch (e) {
    res.send(e);
  }
});

// FIXME product 資料表的 address 和 payment 欄位
// [完成] Create Product
router.post("/", async (req, res, next) => {
  let id = uuidv4(); // 好像有 auto increment 還要用 uuid 嗎
  let created_at = new Date();
  let { name, price, description, express_id } = req.body;

  let [insertData] = await pool.execute(
    // query excute 差異
    "INSERT INTO product (id, name, price, description, express_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, name, price, description, express_id, created_at]
  );
  console.log("New Product Data: ", insertData); // insertedData 是甚麼，為甚麼不是存入的資料
  res.send("Thanks for poasting.");
});

// [完成] Update Product
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const newData = req.body;

  // =====
  const preDataSql = "SELECT * FROM product WHERE id = ?";
  const [preData] = await pool.execute(preDataSql, [id]);
  // res.send(preData);

  const preName = preData[0].name;
  const prePrice = preData[0].price;
  const preDescription = preData[0].description;
  const preexpressId = preData[0].express_id;
  // console.log(preName, prePrice, preDescription, preexpressId);

  // const sql =
  // `UPDATE product SET `
  // `name = ?, price = ?, description = ?,express_id = ? `
  // `WHERE id = ?`;

  // console.log(preData)
  // console.log(newData)

  let sql = "";
  let sqlPreparedArr = [];

  for (let key in preData[0]) {
    // console.log(preData[0][key])
    // console.log(newData[key])
    // console.log(key);

    if (newData[key]) {
      sql += key + " = ?, ";
      sqlPreparedArr.push(newData[key]);
    }
  }
  // console.log(sql);
  // console.log(sqlPreparedArr);

  // 處理最後的、完整的，要執行 update 的 sql 語法
  sql = "UPDATE product SET " + sql.slice(0, -2) + " WHERE id = ?";
  // console.log(sql);  // UPDATE product SET name= ?, price= ?, description= ?, express_id= ?, WHERE id = ?

  // 處理最後的、完整的，要執行 update 的 sql 語法的 prepare statemwnt array
  // console.log(sqlPreparedArr);   // [ 'name', 'price', 'description', 'express_id' ]
  sqlPreparedArr.push(`${id}`);
  // console.log(sqlPreparedArr);

  try {
    let [updateData] = await pool.execute(sql, sqlPreparedArr);
    res.send(`product ${id} has already been updated.`, updateData);
  } catch (e) {
    res.send(e);
  }
});

// [完成] Delete
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  let [deletedData] = await pool.execute("DELETE FROM product WHERE id = ?", [
    id,
  ]);
  console.log("Deleted Data: ", deletedData);
  res.send("The data has been deleted.");
});

// TODO 評論 CRUD
// [完成] Read Product Comment
router.get("/comment/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    let [readProductComment] = await pool.execute(
      "SELECT * FROM comment WHERE id = ?",
      [id]
    );
    res.send(readProductComment);
  } catch (e) {
    req.send(e);
  }
});

// [完成] 評論 Create
router.post("/comment", async (req, res, next) => {
  let { user_id, product_id, content, score } = req.body;
  let created_at = new Date();

  let [createProductComment] = await pool.execute(
    "INSERT INTO comment ( user_id, product_id, content, score, created_at) VALUES (?, ?, ?, ?, ?)",
    [user_id, product_id, content, score, created_at]
  );
  console.log(createProductComment);
  res.send("新增評論成功");
});

// 評論 Update
router.patch("/comment/:id", async (req, res, next) => {
  const { id } = req.params;
  
});

// [完成] 評論 Delete
router.delete("/comment/:id", async (req, res, next) => {
  let { id } = req.params;
  let [deletedProductComment] = await pool.execute(
    "DELETE FROM comment WHERE id = ?",
    [id]
  );
  console.log("Deleted Data: ", deletedProductComment);
  res.send("The comment has been deleted.");
});

module.exports = router;
