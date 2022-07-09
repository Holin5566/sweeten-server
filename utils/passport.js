const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const argon2 = require("argon2");
const passport = require("passport");
const pool = require("./dbConnect");
const { v4: uuidv4 } = require("uuid");
const validate = require("./validation");

/* ------------------------- google 溝通結束, 製作 cookie ------------------------- */
// serializeUser()：可設定要將哪些 user 資訊，儲存在 Session 中的
passport.serializeUser(async (user, done) => {
  // 從 GoogleStrategy 獲得 user
  console.log("serializeUser");

  done(null, { ...user, from: "serializeUser" }); //user 存入 session
});
/* --------------------------- 收到 req，解密 session -------------------------- */
// deserializeUser()：可藉由從 Session 中獲得的資訊去撈該 user 的資料。
passport.deserializeUser((user, done) => {
  console.log("deserializeUser");
  //  get user -> done(null,user)
  done(null, { ...user, from: "deserializeUser" });
});
/* ------------------------------ google 登入後執行 ------------------------------ */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8001/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const user = {
        email: profile.emails[0].value,
        name: profile.displayName,
        id: profile.id,
        provider: profile.provider,
        accessToken,
        refreshToken,
      };
      // found user -> done(null,user)
      let sql = "SELECT * FROM user WHERE email = ?";
      const [searchEmail] = await pool.execute(sql, [user.email]),
        hasCreated = searchEmail.length > 0;
      if (!hasCreated) {
        // not fount -> create user -> done(null,user)
        sql =
          "INSERT INTO user (email, password, full_name,id) VALUES (?, ?, ?, ?)";
        await pool.execute(sql, [user.email, uuidv4(), user.name, user.id]);
      }

      done(null, user); // 設定 session
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { error, msg } = validate.login({ email, password });
      if (error) return res.status(404).send(msg);

      try {
        // // 確認用戶存在
        const sql = "SELECT * FROM `user` WHERE `user`.`email` = ? ";
        const [data] = await pool.execute(sql, [email]);
        if (data.length < 1) throw "用戶不存在";
        const user = data[0];
        // 驗證密碼
        const passwordVerify = await argon2.verify(user.password, password);
        if (!passwordVerify) throw "密碼驗證失敗";

        // make session
        const currentUser = {
          id: user.id,
          email: user.email,
          birthday: user.birthday,
          create_at: user.create_at,
          phone: user.phone,
          user_photo_id: user.user_photo_id,
        };
        done(null, currentUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
