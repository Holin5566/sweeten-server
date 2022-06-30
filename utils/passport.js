const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const LocalStrategy = require("passport-local");
const passport = require("passport");
const pool = require("./dbConnect");
const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

/* ------------------------- google 溝通結束, 製作 cookie ------------------------- */
// serializeUser()：可設定要將哪些 user 資訊，儲存在 Session 中的
passport.serializeUser(async (user, done) => {
  // 從 GoogleStrategy 獲得 user
  console.log("serializeUser");

  // 確認重複
  let sql = "SELECT * FROM user WHERE email = ?";
  const [searchEmail] = await pool.execute(sql, [user.email]),
    hasCreated = searchEmail.length > 0;
  if (!hasCreated) {
    // 不重複則註冊
    sql = "INSERT INTO user (email, password, full_name) VALUES (?, ?, ?)";
    await pool.execute(sql, [user.email, uuidv4(), user.name]);
  }

  done(null, "123"); //user 存入 session
});

/* --------------------------- 收到 req，解密 session -------------------------- */
// deserializeUser()：可藉由從 Session 中獲得的資訊去撈該 user 的資料。
passport.deserializeUser((user, done) => {
  console.log("deserializeUser");
  //  get user -> done(null,user)
  done(null, user);
});

// passport.use(
//   new LocalStrategy((email, password, done) => {
//     console.log(email, password);
//     // done
//   })
// );

/* ------------------------------ google 登入後執行 ------------------------------ */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8001/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      // found user -> done(null,user)
      // not fount -> create user -> done(null,user)
      done(null, {
        email: profile.emails[0].value,
        name: profile.displayName,
        id: profile.id,
        provider: profile.provider,
        accessToken,
        refreshToken,
      }); // 設定 session
    }
  )
);

module.exports = passport;
