const {
  setCountry,
  users,
  products,
  lessons,
  likedLesson,
  likedProduct,
} = require("./fakeData");

const express = require("express");
const router = express.Router();
require("dotenv").config();

// 專案建立的資料庫模組
const pool = require("../utils/dbConnect");

// router.post("/", async (req, res, next) => {
//   users.map((user) => {
//     console.log(`INSERT INTO user (full_name, email) VALUES ?,?)`, [
//       user.fullname,
//       user.email,
//     ]);
//   });

// const [setData] = await pool.execute(
//   `INSERT INTO user (id, fullname, email, password, birthday, gender_id, country_id, created_at, phone, user_photo_id, valid) VALUES (${user})`
// );
//   res.send("新增資料成功");
// });

// ==================================================

// 縣市假資料

// 使用者假資料
router.post("/users", (req, res, next) => {
  users.map(async (user) => {
    const [setData] = await pool.execute(
      "INSERT INTO user (id, full_name, email, password, birthday, gender_id, country_id, created_at, phone, user_photo_id, valid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.fullname,
        user.email,
        user.password,
        user.birthday,
        user.gender_id,
        user.country_id,
        user.created_at,
        user.phone,
        user.user_photo_id,
        user.valid,
      ]
    );
  });
  res.send("新增 users 資料成功");
});

module.exports = router;
