const express = require("express");
const router = express.Router();
const pool = require("../utils/dbConnect");
const ecpay_payment = require("ECPAY_Payment_node_js");
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming authRouter");
  next();
});

// NOTE 付款成功後轉址到前端
router.post("/sucess", (req, res) => {
  console.log("pay sucess");
  res.redirect(301, "http://localhost:3000/main/test");
});

// NOTE 結帳
router.post("/", async (req, res) => {
  const newOrder = require("../utils/ecpayConfig").newOrder;
  const options = require("../utils/ecpayConfig").options;
  const orderState = req.body;
  // 信用卡號：4311-9522-2222-2222
  // 有效日期：大於今日
  // 安全碼：222

  //req.body =  {
  //     "TotalAmount":總價錢,
  //     "TradeDesc":訂單描述,
  //     "ItemName":商品A#商品B#商品C
  // }

  const base_param = newOrder(orderState);
  const inv_params = {};
  const create = new ecpay_payment(options);

  const checkoutPage = create.payment_client.aio_check_out_all(
    base_param,
    inv_params
  );
  res.send(checkoutPage);
});

module.exports = router;
