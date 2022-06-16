const express = require("express");
const { app } = require("firebase-admin");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
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

// Update Product
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const newData = req.body;

  // =====
  const preDataSql = "SELECT * FROM product WHERE id = ?";
  const [preData] = await pool.execute(preDataSql, [id]);
  res.send(preData);

  const preName = preData[0].name;
  const prePrice = preData[0].price;
  const preDescription = preData[0].description;
  const preexpressId = preData[0].express_id;

  console.log(preName, prePrice, preDescription, preexpressId);

  
  // const sql = `UPDATE product SET name = ?, price = ?, description = ?,express_id = ?  WHERE id = ?`;

  // let [updateData] = await pool.execute(sql, [
  //   name,
  //   price,
  //   description,
  //   express_id,
  //   id,
  // ]);

  // =====
  
  // const sql = `UPDATE product SET name = ?, price = ?, description = ?,express_id = ?, address = ?, payment = ?  WHERE id = ?`;

  // try {
  //   let [updateData] = await pool.execute(sql, [
  //     name,
  //     price,
  //     description,
  //     express_id,
  //     address,
  //     payment,
  //     id,
  //   ]);
  //   console.log("Update Data: ", updateData);
  //   res.send("updated successfully.");
  // } catch (e) {
  //   res.send(e);
  // }

  // 沒註解
  // const [data] = await pool.execute(`SELECT * FROM product WHERE id = ?`, [id]);
  // const preData = data[0];

  // const sql = `UPDATE product
  // SET name = ?, price = ?, description = ?, express_id = ?
  // WHERE id = ?`;
  // const query = [];

  // res.send(query);
  // 沒註解

  // try {
  //   let [updateData] = await pool.execute(sql, [name, price, id]);
  //   console.log("Update Data: ", updateData);
  //   res.send("updated successfully.");
  // } catch (e) {
  //   res.send(e);
  // }
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

// 評論 Create
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

// 評論 Delete
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
