const {
  setGender,
  setCountry,
  users,
  setExpressId,
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

// 性別
router.post("/gender", (req, res, next) => {
  try {
    setGender.map(async (gender) => {
      const [setGender] = await pool.execute(
        "INSERT INTO gender (id, name) VALUES (?, ?)",
        [gender.id, gender.name]
      );
    });
    res.send("新增 gender 資料成功");
  } catch (e) {
    res.send(e);
  }
});

// 縣市
router.post("/country", (req, res, next) => {
  try {
    setCountry.map(async (country) => {
      const [setCountry] = await pool.execute(
        "INSERT INTO country (id, name) VALUES (?, ?)",
        [country.id, country.name]
      );
    });
    res.send("新增 country 資料成功");
  } catch (e) {
    res.send(e);
  }
});

// 使用者假資料
router.post("/users", (req, res, next) => {
  try {
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
  } catch (e) {
    res.send(e);
  }
});

// expressId
router.post("/express", (req, res, next) => {
  try {
    setExpressId.map(async (express) => {
      const [setCountry] = await pool.execute(
        "INSERT INTO express (id, name) VALUES (?, ?)",
        [express.id, express.name]
      );
    });
    res.send("新增 express 資料成功");
  } catch (e) {
    res.send(e);
  }
});

// 產品假資料
router.post("/product", (req, res, next) => {
  try {
    products.map(async (product) => {
      const [setProducts] = await pool.execute(
        "INSERT INTO product (id, name, price, description, express_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          product.id,
          product.name,
          product.price,
          product.description,
          product.express_id,
          product.created_at,
        ]
      );
    });
    res.send("新增 product 資料成功");
  } catch (e) {
    res.send(e);
  }
});

// 課程假資料
router.post("/lesson", (req, res, next) => {
  try {
    lessons.map(async (lesson) => {
      const [setlessons] = await pool.execute(
        "INSERT INTO lesson (id, name, price, description, start_date, duration) VALUES (?, ?, ?, ?, ?, ?)",
        [
          lesson.id,
          lesson.name,
          lesson.price,
          lesson.description,
          lesson.start_date,
          lesson.duration,
        ]
      );
    });
    res.send("新增 lesson 資料成功");
  } catch (e) {
    res.send(e);
  }
});

// favoritLesson
router.post("/favoriteLesson", (req, res, next) => {
  try {
    likedLesson.map(async (favoriteLesson) => {
      const [setFavoriteLesson] = await pool.execute(
        "INSERT INTO favorit_lesson (user_id, lesson_id) VALUES (?, ?)",
        [favoriteLesson.user_id, favoriteLesson.lesson_id]
      );
    });
    res.send("新增 課程收藏 資料成功");
  } catch (e) {
    res.send(e);
  }
});

// favoritLesson
router.post("/favoriteProduct", (req, res, next) => {
  try {
    likedProduct.map(async (favoriteProduct) => {
      const [setFavoriteProduct] = await pool.execute(
        "INSERT INTO favorit_product (user_id, product_id) VALUES (?, ?)",
        [favoriteProduct.user_id, favoriteProduct.product_id]
      );
    });
    res.send("新增 商品收藏 資料成功");
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
