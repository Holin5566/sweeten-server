const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
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

module.exports = router;
