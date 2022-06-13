const express = require("express");
const { app } = require("firebase-admin");
const router = express.Router();
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming from productRouter");
  next();
});

// TODO 商品 CRUD
// 未完成 Read
router.get("/:id", (req, res, next) => {
  // console.log(req.body)
  res.send("test");
});

// Create
router.post("/create/:id", (req, res, next) => {
  // console.log(req.params);
  // console.log(req.query);
  let data = req.body;
  console.log(data);
  res.send(data);
});

// Uudate

// Delete
router.delete("/delete/:id", (req, res, next)=>{
  res.send("The product has been deleted")
})

// TODO 評論 CRUD
// TODO 評分 RU

module.exports = router;
