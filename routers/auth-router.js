const express = require("express");
const router = express.Router();
// const argon2 = require("argon2");
const pool = require("../utils/dbConnect");
// const { response } = require("express");
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming authRouter");
  next();
});
router.post("/sucess", function (req, res) {
  console.log("pay sucess");
  res.redirect(301, "http://localhost:3000/main/test");
});

router.post("/pay", async (req, res) => {
  // 信用卡號：4311-9522-2222-2222
  // 有效日期：大於今日
  // 安全碼：222
  const ecpay_payment = require("ECPAY_Payment_node_js");
  const base_param = {
    MerchantTradeNo: "v3ruWV9RJ1JKnQxd3qg4", //post //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: "2017/02/13 15:45:30", //post  //ex:2017/02/13 15:45:30
    TotalAmount: "100", //post  //總金額
    TradeDesc: "測試交易描述", //post
    ItemName: "測試商品等", //post
    ReturnURL: "http://localhost:8001/api/auth/sucess",
    OrderResultURL: "http://localhost:8001/api/auth/sucess",
  };
  const inv_params = {};
  const options = require("../utils/ecpayConfig").options,
    create = new ecpay_payment(options),
    htm = create.payment_client.aio_check_out_all(base_param, inv_params);

  res.send(htm);
});

// TODO 註冊會員
// router.get("/signup", async (req, res) => {
//   try {
//     const hash = await argon2.hash("password");
//     res.send(hash);
//   } catch {
//     (e) => res.send(e);
//   }
// });

//TODO 會員  CRUD
//[完成] Read Product
router.get("/:id", async (req, res, next) => {
  try {
    let [auth] = await pool.execute("SELECT * FROM user WHERE id = ?", [
      req.params.id,
    ]);
    res.send(auth);
  } catch (e) {
    res.send(e);
  }
});

//TODO 會員 製作身分驗證
//[完成] CREATE
router.post("/", async (req, res, next) => {
  let {
    id,
    full_name,
    birthday,
    gender_id,
    country_id,
    created_at,
    phone,
    user_photo_id,
    valid,
  } = req.body;
  let [insertData] = await pool.execute(
    "INSERT INTO user (id, full_name, birthday, gender_id, country_id, created_at, phone, user_photo_id, valid) VALUE (?, ? ,?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      full_name,
      birthday,
      gender_id,
      country_id,
      created_at,
      phone,
      user_photo_id,
      valid,
    ]
  );
  console.log("New Auth Data: ", insertData); // insertedData 是甚麼，為甚麼不是存入的資料
  res.send("Thanks for poasting");
});

//TODO 刪除會員資料
//[完成]
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  let [deleteData] = await pool.execute("DELETE FROM user WHERE id = ?", [id]);
  console.log("Delete Data: ", deleteData);
  res.send(`你已經成功刪除了ID 為 ${id}的帳號`);
});

// TODO middleware 驗證身分
// TODO 會員登入
// TODO 會員登出
//TODO auth test 好了要刪掉
// // create
// // {name: "test", email: "testtest@gmail.com", password: "testtest"}
// router.post("/", async (req, res) => {
//   const {
//     body: { name, email, password },
//   } = req;
//   // if (await userExist(email)) return res.send("用戶存在");

//   try {
//     const hash = await argon2.hash(password);
//     // 儲存帳號資訊
//     await pool.execute(
//       "INSERT INTO test_user (email, password, name) VALUES (?, ?, ?)",
//       [email, hash, name]
//     );
//     res.send("註冊成功");
//   } catch (e) {
//     res.send("註冊失敗");
//   }
// });

// // login
// router.post("/login", async (req, res) => {
//   // 取值
//   const { email, password } = req.body;

//   try {
//     const sql = "SELECT * FROM test_user WHERE email = ?";
//     const [data] = await pool.execute(sql, [email]);

//     // 確認用戶存在
//     if (!data.length) return console.log("用戶不存在");
//     const user = data[0];

//     // 驗證密碼
//     const passwordVerify = await argon2.verify(user.password, password);
//     if (!passwordVerify) return console.log("密碼驗證失敗");

//     // make session
//     req.session.user = { email };
//     res.send(sessionUser);
//   } catch (e) {
//     res.send(err);
//   }
// });

module.exports = router;
