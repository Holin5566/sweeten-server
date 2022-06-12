const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
require("dotenv").config();

router.use((req, res, next) => {
  console.log("request is comming authRouter");
  next();
});

router.get("/signup", async (req, res) => {
  try {
    const hash = await argon2.hash("password");
    res.send(hash);
  } catch {
    (e) => res.send(e);
  }
});

module.exports = router;
