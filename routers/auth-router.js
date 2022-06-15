const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const pool = require("../utils/dbConnect");
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming authRouter");
  next();
});

// TODO 註冊會員
router.get("/signup", async (req, res) => {
  try {
    const hash = await argon2.hash("password");
    res.send(hash);
  } catch {
    (e) => res.send(e);
  }
});

// TODO middleware 驗證身分

// TODO 會員登入
// TODO 會員登出

//TODO auth test 好了要刪掉
// create
// {name: "test", email: "testtest@gmail.com", password: "testtest"}
router.post("/", async (req, res) => {
  const {
    body: { name, email, password },
  } = req;
  // if (await userExist(email)) return res.send("用戶存在");

  try {
    const hash = await argon2.hash(password);
    // 儲存帳號資訊
    await pool.execute(
      "INSERT INTO test_user (email, password, name) VALUES (?, ?, ?)",
      [email, hash, name]
    );
    res.send("註冊成功");
  } catch (e) {
    res.send("註冊失敗");
  }
});

// login
router.post("/login", async (req, res) => {
  // 取值
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM test_user WHERE email = ?";
    const [data] = await pool.execute(sql, [email]);

    // 確認用戶存在
    if (!data.length) return console.log("用戶不存在");
    const user = data[0];

    // 驗證密碼
    const passwordVerify = await argon2.verify(user.password, password);
    if (!passwordVerify) return console.log("密碼驗證失敗");

    // make session
    req.session.user = { email };
    res.send(sessionUser);
  } catch (e) {
    res.send(err);
  }
});

module.exports = router;
