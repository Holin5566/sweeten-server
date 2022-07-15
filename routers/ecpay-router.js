const express = require("express");
const router = express.Router();
const pool = require("../utils/dbConnect");
const ecpay_payment = require("ecpay_aio_nodejs");
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming authRouter");
  next();
});

// NOTE 付款成功後轉址到前端
router.post("/sucess", (req, res) => {
  console.log("pay sucess");
  console.log(req.body);
  res.redirect(301, "http://localhost:3000/");
});

/* --------------------------------- 確認付款狀態 --------------------------------- */
router.post("/check", async (req, res) => {
  const options = require("../utils/ecpayConfig").options;
  console.log("check");
  const { ecpay_id } = req.body;
  const param = { MerchantTradeNo: ecpay_id };
  const query = new ecpay_payment(options);
  try {
    const result = await query.query_client.query_trade_info(param);
    const data = {};
    result.split("&").forEach((str) => {
      const pair = str.split("=");
      console.log(pair);
      data[pair[0]] = pair[1];
    });
    res.send(data);
  } catch (e) {
    res.send(e);
  }
});

// NOTE 結帳.
router.post("/", async (req, res) => {
  const newOrder = require("../utils/ecpayConfig").newOrder;
  const options = require("../utils/ecpayConfig").options;
  const orderState = req.body;
  // 信用卡號：4311-9522-2222-2222
  // 有效日期：大於今日
  // 安全碼：222
  const {
    TotalAmount,
    TradeDesc,
    ItemName,
    address,
    order_status_id,
    user_id,
    products,
  } = orderState;
  const base_param = newOrder({ TotalAmount, TradeDesc, ItemName });
  //req.body =  {...
  //     "TotalAmount":總價錢,
  //     "TradeDesc":訂單描述,
  //     "ItemName":商品A#商品B#商品C
  //     "products":[{product_id,order_info_id,memo,price},{product_id,order_info_id,memo,price}]
  //     "address": str
  //     "order_status_id": 1
  //     "user_id": str
  // }
  /* --------------------------- 儲存訂單 info, product --------------------------- */

  try {
    let sql = `INSERT INTO order_info (user_id, address, order_status_id, id) VALUES (?, ?, ?, ?)`;
    await pool.execute(sql, [user_id, address, 1, base_param.MerchantTradeNo]);
    sql = `INSERT INTO order_product ( order_info_id, product_id, memo, price) VALUES (?, ?, ?, ?)`;
    const items = JSON.parse(products);
    for (let i = 0; i < items.length; i++) {
      await pool.execute(sql, [
        base_param.MerchantTradeNo,
        items[i].id,
        items[i].count,
        items[i].price,
      ]);
    }
  } catch (e) {
    console.log(e);
  }

  const inv_params = {};
  const create = new ecpay_payment(options);
  // TODO 儲存訂單編號
  // TODO 儲存訂單商品

  const checkoutPage = create.payment_client.aio_check_out_all(
    base_param,
    inv_params
  );
  res.send(checkoutPage);
});

module.exports = router;
