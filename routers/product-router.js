const express = require("express");
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
// [完成] Read Product (所有產品 valid = 1)
router.get("/all", async (req, res, next) => {
  try {
    // 沒有頁碼的情況
    // let [products] = await pool.execute("SELECT * FROM product");

    // 篩選
    // [價格] ASC DESC
    let priceOrder = req.query.priceOrder;
    // console.log(priceOrder);

    if (priceOrder == "2") {
      orderByPrice = "DESC";
      // console.log(orderByPrice);
    } else {
      orderByPrice = "ASC";
      // console.log(orderByPrice);
    }

    // 取得目前的總筆數
    let [products] = await pool.execute(
      `SELECT * FROM product WHERE valid = ? ORDER BY price ${orderByPrice}`,
      [1]
    );

    // 回覆給前端
    if (products.length === 0) {
      res.status(404).json(products);
    } else {
      res.json({
        data: products,
      });
    }
  } catch (e) {
    res.send(e);
  }
});

// [完成] Read Product (所有產品 valid = 1)
router.get("/", async (req, res, next) => {
  try {
    // 沒有頁碼的情況
    // let [products] = await pool.execute("SELECT * FROM product");

    // 篩選
    // [價格] ASC DESC
    let priceOrder = req.query.priceOrder;
    // console.log(priceOrder);

    if (priceOrder == "2") {
      orderByPrice = "DESC";
      // console.log(orderByPrice);
    } else {
      orderByPrice = "ASC";
      // console.log(orderByPrice);
    }

    // 頁碼
    // 過濾參數用 query string 來傳遞
    // 取得目前在第幾頁，而且利用 || 這個特性來做預設值
    // console.log(req.query.page)   // 如果網址上沒有 page 這個 query string，那 req.query.page 會是 undefined(false)
    let page = req.query.page || 1;
    // console.log("current page: ", page);

    // 取得目前的總筆數
    let [products] = await pool.execute(
      "SELECT * FROM product WHERE valid = ?",
      [1]
    );
    const totalRecords = products.length;
    // console.log("total records: ", totalRecords);

    // 計算總共有幾頁
    let perPage = 12;
    let totalPage = Math.ceil(totalRecords / perPage);
    // console.log("total page: ", totalPage);

    // 計算 offset 是多少(計算要跳過幾筆)
    let offset = (page - 1) * perPage;
    // console.log("offset: ", offset);

    // 取得這一頁的資料 select * ... limit ? offset ?
    let [pageResult] = await pool.execute(
      `SELECT * FROM product WHERE valid = ? ORDER BY price ${orderByPrice} LIMIT ? OFFSET ?`,
      [1, perPage, offset]
    );
    // console.log(pageResult)

    // 回覆給前端
    if (pageResult.length === 0) {
      res.status(404).json(pageResult);
    } else {
      res.json({
        pagination: {
          totalRecords,
          totalPage,
          page,
        },
        data: pageResult,
      });
    }
  } catch (e) {
    res.send(e);
  }
});
router.get("/all_data", async (req, res, next) => {
  let [data] = await pool.execute("SELECT * FROM expriy");
  console.log(data);
  res.send(data);
});
// TODO 商品喜歡的 USER有哪些
router.get("/comment/product/:id", async (req, res, next) => {
  try {
    let [product_comment] = await pool.execute(
      "SELECT * FROM comment,user,product WHERE comment.user_id=user.id AND comment.product_id=product.id AND product_id = ?",
      [req.params.id]
    );
    res.send(product_comment);
  } catch (e) {
    res.send(e);
  }
});

router.get("/category/:categoryId", async (req, res, next) => {
  try {
    // 價格排序
    let priceOrder = req.query.priceOrder;
    if (priceOrder == "2") {
      orderByPrice = "DESC";
    } else {
      orderByPrice = "ASC";
    }

    // 種類篩選
    let { categoryId } = req.params;

    // 頁碼
    let page = req.query.page || 1;

    // 取得目前的總筆數
    const [product] = await pool.execute(
      `SELECT product.name AS product, product.price, product.description, product.express_id, category.name AS category 
      FROM product, product_category, category 
      WHERE product.valid = ? AND product_category.product_id = product.id AND product_category.category_id = category.id AND category.id = ?`,
      [1, categoryId]
    );
    const totalResults = product.length;

    // 計算總共有幾頁
    const perPage = 10;
    const totalPage = Math.ceil(totalResults / perPage);
    // console.log(totalPage);

    // 計算 offset 是多少(計算要跳過幾筆)
    const offset = (page - 1) * perPage;
    // console.log(offset);

    // 取得這一頁的資料 select * ... limit ? offset ?
    const [pageResult] = await pool.execute(
      `SELECT product.name AS product, product.price, product.description, product.express_id, category.name AS category 
      FROM product, product_category, category 
      WHERE product.valid = ? AND product_category.product_id = product.id AND product_category.category_id = category.id AND category.id = ?
      ORDER BY price ${orderByPrice}
      LIMIT ?
      OFFSET ?`,
      [1, categoryId, perPage, offset]
    );

    // 回覆給前端
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

// [完成] Read Product (所有產品 valid = 0)
router.get("/discontinued", async (req, res, next) => {
  try {
    let [productDiscontinued] = await pool.execute(
      "SELECT * FROM product WHERE valid = 0"
    );

    res.send(productDiscontinued);
  } catch (e) {
    res.send(e);
  }
});

/* ---------------------------- [完成] Read Product (個別產品) ---------------------------- */
router.get("/:id", async (req, res, next) => {
  try {
    // let [product] = await pool.execute(
    //   "SELECT * FROM product WHERE valid = ? AND id = ?",
    //   [1, req.params.id]
    // );
    let [product] = await pool.execute(
      "SELECT product_photo.name AS img_name, product_photo.path, product.* FROM product_photo, product product.id = ? AND valid = ?",
      [1, req.params.id]
    );

    res.send(product);
  } catch (e) {
    res.send(e);
  }
});

/* ------------------------- // [完成] Create Product (沒有圖片) ------------------------- */
router.post("/", async (req, res, next) => {
  // let id = () => String(+new Date()).slice(0, 10);
  let created_at = new Date();
  let { id, name, price, description, express_id } = req.body;
  console.log(req.body);
  // 產品資料 sql
  let [insertData] = await pool.execute(
    // query excute 差異
    "INSERT INTO product (id, name, price, description, express_id, created_at, valid) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
    [id, name, price, description, express_id, created_at, 1]
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
    res.send(`product ${id} has already been updated.`);
  } catch (e) {
    res.status(404);
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

// [完成] 評論 Update
router.patch("/comment/:id", async (req, res, next) => {
  const { id } = req.params;
  const newComment = req.body;

  const [preComment] = await pool.execute(
    "SELECT * FROM comment WHERE id = ?",
    [id]
  );

  let sql = "";
  let sqlPreparedArr = [];

  for (let key in preComment[0]) {
    // console.log(key)
    if (newComment[key]) {
      sql += key + " = ?, ";
      sqlPreparedArr.push(newComment[key]);
    }
  }
  // console.log(sql);
  // console.log(sqlPreparedArr);

  sql = "UPDATE comment SET " + sql.slice(0, -2) + " Where id = ?";
  // console.log(sql);
  sqlPreparedArr.push(`${id}`);
  // console.log(sqlPreparedArr)

  try {
    const [updateComment] = await pool.execute(sql, sqlPreparedArr);
    res.send("The comment has been updated.");
  } catch (e) {
    res.status(404);
    res.send(e);
  }
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
//test read所有商品
// router.get("/all_data", async (req, res, next) => {
//   let [data] = await pool.execute("SELECT * FROM expriy");
//   console.log(data);
//   res.send(data);
// });
// TODO 即期品 Read
router.get("/expire_product", async (req, res, next) => {
  try {
    // 篩選
    // [價格] ASC DESC
    let priceOrder = req.query.priceOrder;

    if (priceOrder == "2") {
      orderByPrice = "DESC";
      // console.log(orderByPrice);
    } else {
      orderByPrice = "ASC";
      // console.log(orderByPrice);
    }

    // 頁碼
    // 過濾參數用 query string 來傳遞
    // 取得目前在第幾頁，而且利用 || 這個特性來做預設值
    // console.log(req.query.page)   // 如果網址上沒有 page 這個 query string，那 req.query.page 會是 undefined(false)
    let page = req.query.page || 1;
    // console.log("current page: ", page);

    // 取得目前的總筆數
    let [expireProducts] = await pool.execute("SELECT * FROM expriy");
    const totalRecords = expireProducts.length;
    console.log(totalRecords);
    // console.log("total records: ", totalRecords);

    // 計算總共有幾頁
    let perPage = 1;
    let totalPage = Math.ceil(totalRecords / perPage);
    // console.log("total page: ", totalPage);

    // 計算 offset 是多少(計算要跳過幾筆)
    let offset = (page - 1) * perPage;
    // console.log("offset: ", offset);

    // 取得這一頁的資料 select * ... limit ? offset ?
    let [pageResult] = await pool.execute(
      `SELECT name, price,expriy.id,count,expriy.expriy_date FROM product, expriy WHERE expriy.product_id=product.id LIMIT ? OFFSET ?`,
      [perPage, offset]
    );
    console.log(pageResult);

    // 回覆給前端
    if (pageResult.length === 0) {
      res.status(404).json(pageResult);
    } else {
      res.json({
        pagination: {
          totalRecords,
          totalPage,
          page,
        },
        data: pageResult,
      });
    }
  } catch (e) {
    res.send(e);
  }
});

// NOTE 上傳圖片

router.get("/", async (req, res, next) => {
  try {
    // 沒有頁碼的情況
    // let [products] = await pool.execute("SELECT * FROM product");

    // 篩選
    // [價格] ASC DESC
    let priceOrder = req.query.priceOrder;
    // console.log(priceOrder);

    if (priceOrder == "2") {
      orderByPrice = "DESC";
      // console.log(orderByPrice);
    } else {
      orderByPrice = "ASC";
      // console.log(orderByPrice);
    }

    // 頁碼
    // 過濾參數用 query string 來傳遞
    // 取得目前在第幾頁，而且利用 || 這個特性來做預設值
    // console.log(req.query.page)   // 如果網址上沒有 page 這個 query string，那 req.query.page 會是 undefined(false)
    let page = req.query.page || 1;
    // console.log("current page: ", page);

    // 取得目前的總筆數
    let [products] = await pool.execute("SELECT * FROM product");
    const totalRecords = products.length;
    // console.log("total records: ", totalRecords);

    // 計算總共有幾頁
    let perPage = 12;
    let totalPage = Math.ceil(totalRecords / perPage);
    // console.log("total page: ", totalPage);

    // 計算 offset 是多少(計算要跳過幾筆)
    let offset = (page - 1) * perPage;
    // console.log("offset: ", offset);

    // 取得這一頁的資料 select * ... limit ? offset ?
    let [pageResult] = await pool.execute(
      `SELECT * FROM product ORDER BY price ${orderByPrice} LIMIT ? OFFSET ?`,
      [perPage, offset]
    );
    // console.log(pageResult)

    // 回覆給前端
    if (pageResult.length === 0) {
      res.status(404).json(pageResult);
    } else {
      res.json({
        pagination: {
          totalRecords,
          totalPage,
          page,
        },
        data: pageResult,
      });
    }
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

// [完成] Create Product
router.post("/", async (req, res, next) => {
  // let id = uuidv4(); // 好像有 auto increment 還要用 uuid 嗎
  let created_at = new Date();
  let { name, price, description, express_id } = req.body;

  let [insertData] = await pool.execute(
    // query excute 差異
    "INSERT INTO product ( name, price, description, express_id, created_at, valid) VALUES ( ?, ?, ?, ?, ?, ?)",
    [name, price, description, express_id, created_at, 1]
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
    res.send(`product ${id} has already been updated.`);
  } catch (e) {
    res.status(404);
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
const uploader = require("../utils/uploader");

// upload.single("photo") -> 抓取 key = photo 的資料, 存入 storage
router.post("/photo", uploader.single("photo"), async (req, res) => {
  // console.log(req.file);
  let { id } = req.body;
  let created_at = new Date();
  // console.log(req.body);

  // let productId = () => String(+new Date()).slice(0, 10);
  const photoName = req.file.originalname.split(".").slice(-2, -1)[0];
  const path = req.file.path;
  let { name, price, description, express_id } = req.body;

  // 產品資料 sql
  let [insertData] = await pool.execute(
    // query excute 差異
    "INSERT INTO product (id, name, price, description, express_id, created_at, valid) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
    [id, name, price, description, express_id, created_at, 1]
  );

  // 產品圖片 sql
  let [insertImg] = await pool.execute(
    "INSERT INTO product_photo (product_id, name, path) VALUES (?, ?, ?)",
    [id, photoName, path]
  );
  res.send(req.file);
});

module.exports = router;
