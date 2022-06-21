// =============== 使用者 * 10 ===============

const userMaker = (
  id,
  fullname,
  email,
  password,
  birthday,
  gender_id,
  country_id,
  created_at,
  phone,
  user_photo_id,
  valid
) => {
  return {
    id,
    fullname,
    email,
    password,
    birthday,
    gender_id,
    country_id,
    created_at,
    phone,
    user_photo_id,
    valid,
  };
};

// 使用者名字
let varName = () => Math.random().toString(36).substr(2);

// 使用者生日
const month = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const day = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
];
let selectMonth = () => Math.floor(Math.random() * month.length);
let selectDay = () => Math.floor(Math.random() * day.length);
let varBirth = () => month[selectMonth()] + day[selectDay()];

// 使用者性別
let varGender = () => Math.floor(Math.random() * 2) + 1;

// 使用者縣市(?)
const country = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
let selectCountry = () => Math.floor(Math.random() * country.length);
let varCountry = () => country[selectCountry()];

// 使用者電話
const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let selectNumber = () => Math.floor(Math.random() * number.length);
let varPhone = () =>
  number[selectNumber()] +
  number[selectNumber()] +
  number[selectNumber()] +
  number[selectNumber()] +
  number[selectNumber()] +
  number[selectNumber()] +
  number[selectNumber()] +
  number[selectNumber()];

const users = [];

for (let i = 1; i < 11; i++) {
  users.push(
    userMaker(
      `user ${i}`,
      varName(),
      `${i}${i}${i}@gmail.com`,
      "12345",
      varBirth(),
      varGender(),
      varCountry(),
      new Date(),
      `09${varPhone()}`,
      `${i}`,
      1
    )
  );
}
// console.log(users);

// =============== 產品 * 100 ===============
const productMaker = (id, name, price, description, express_id, created_at) => {
  return { id, name, price, description, express_id, created_at };
};

// 商品價格
let varPrice = () => Math.ceil(Math.random() * 10) * 100 + 400;

// 商品說明
let varStr = () => Math.random().toString(36).substr(2);

// 貨運方式
let varExpress = () => Math.floor(Math.random() * 2) + 1;

const products = [];

for (let i = 1; i < 101; i++) {
  products.push(
    productMaker(
      `${i}`,
      `product ${i}`,
      varPrice(),
      varStr(),
      varExpress(),
      new Date()
    )
  );
}
// console.log(products);

// =============== 課程 * 100 ===============
const lessonMaker = (id, name, price, description, start_date, duration) => {
  return { id, name, price, description, start_date, duration };
};

const varDuration = () => Math.ceil(Math.random() * 10) * 10 + 30;

const lessons = [];

for (let i = 1; i < 101; i++) {
  lessons.push(
    lessonMaker(
      `${i}`,
      `lesson ${i}`,
      varPrice(),
      varStr(),
      `2022${varBirth()}`, // 借用使用者選生日的方法
      varDuration()
    )
  );
}
// console.log(lessons);

// =============== favorite_product * 50 ===============
const likedProductMaker = (user_id, product_id) => {
  return { user_id, product_id };
};

// 使用者 id 亂數
const varUserId = () => Math.ceil(Math.random() * 10);

// 商品 id 亂數
const varProductId = () => Math.ceil(Math.random() * 100);

const likedProduct = [];

for (let i = 1; i < 51; i++) {
  likedProduct.push(likedProductMaker(varUserId(), varProductId()));
}
// console.log(likedProduct);

// =============== favorite_lesson * 50 ===============
const likedLessonMaker = (user_id, lesson_id) => {
  return { user_id, lesson_id };
};

// 課程 id 亂數
const varLessonId = () => Math.ceil(Math.random() * 100);

const likedLesson = [];

for (let i = 1; i < 51; i++) {
  likedLesson.push(likedLessonMaker(varUserId(), varLessonId()));
}
// console.log(likedLesson);

// 亂數選字的方法 (參考)
// const list = ["a","b","c"]
// list[Math.random()]

module.exports = {
  users,
  products,
  lessons,
  likedLesson,
  likedProduct,
};
