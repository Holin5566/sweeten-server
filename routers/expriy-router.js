const express = require("express");
const router = express.Router();
require("dotenv").config();
// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

router.use((req, res, next) => {
  console.log("request is comming userRouter");
  next();
});
// NOTE READ 即期品全部資料沒有頁碼

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
    let [expireProducts] = await pool.execute("SELECT * FROM expiry");
    const totalRecords = expireProducts.length;
    console.log(totalRecords);
    // console.log("total records: ", totalRecords);

    // 計算總共有幾頁
    let perPage = 15;
    let totalPage = Math.ceil(totalRecords / perPage);
    // console.log("total page: ", totalPage);

    // 計算 offset 是多少(計算要跳過幾筆)
    let offset = (page - 1) * perPage;
    // console.log("offset: ", offset);

    // 取得這一頁的資料 select * ... limit ? offset ?
    let [pageResult] = await pool.execute(
      `SELECT name, price,count,description, expiry.* FROM product, expiry WHERE expiry.product_id=product.id ORDER BY expiry_date ASC LIMIT ? OFFSET ?`,
      [perPage, offset]
    );
    // console.log(pageResult);

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
// TODO 即期良品 POST
router.post("/", async (req, res, next) => {
  let { id, expiry_date, count, discount } = req.body;
  let [inserData] = await pool.execute(
    "INSERT INTO expiry (product_id, expiry_date, count, discount) VALUES (?, ?, ?, ?)",
    [id, expiry_date, count, discount]
  );
  res.json("資料更新囉");
});

// TODO 即期良品 DELETE by id
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  // console.log(id);

  let [deleteExpiryById] = await pool.execute(
    "DELETE FROM expiry WHERE id = ?",
    [id]
  );
  res.send("成功刪除即期品");
});

module.exports = router;
