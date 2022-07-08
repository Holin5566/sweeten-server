const multer = require("multer");
const path = require("path");
const storePath = path.join(__dirname, "..", "public", "user");
// console.log("__dirname", __dirname);

//NOTE 儲存路徑設定
const storage = multer.diskStorage({
  // 定義路徑
  destination: (req, file, cb) => {
    cb(null, storePath); // "../public/product";
  },

  // 定義檔案名稱
  filename: (req, file, cb) => {
    // "name.jpg" -> ["name","jpg"] -> ext:"jpg"
    let ext = file.originalname.split(".").pop();
    let newFilename = `${Date.now()}.${ext}`;
    //     let newFilename = `${req.body.id}.jpg`;
    cb(null, newFilename);
  },
});

//NOTE 格式篩選
const fileFilter = (req, file, cb) => {
  // 設定格式( file.mimetype !== "image/允許格式" )
  const wrongFile =
    file.mimetype !== "image/jpeg" &&
    file.mimetype !== "image/jpg" &&
    file.mimetype !== "image/png";

  if (wrongFile) cb("格式錯誤", false);
  if (!wrongFile) cb(null, true);
};

//NOTE 大小限制
const limits = {
  // 1k = 1024
  fileSize: 200 * 1024,
  // fieldNameSize :  Max field name size // 100 bytes
  // fieldSize :  Max field value size (in bytes) // 1MB
  // fields : Max number of non-file fields // Infinity
  // fileSize : For multipart forms, the max file size (in bytes) // Infinity
  // files :  For multipart forms, the max number of file fields  // Infinity
  // parts :  For multipart forms, the max number of parts (fields + files) // Infinity
  // headerPairs :  For multipart forms, the max number of header key=>value pairs to parse // 2000
};

const uploader_user = multer({ storage, fileFilter, limits });

module.exports = uploader_user;