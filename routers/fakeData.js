// =============== 性別 ===============
const genderMaker = (id, name) => {
  return { id, name };
};

const genderName = ["男", "女", "不提供"];

const setGender = [];

for (let i = 1; i < 4; i++) {
  setGender.push(genderMaker(`${i}`, genderName[i - 1]));
}
// console.log(setGender);

// =============== 縣市 * 12 ===============
const countryMaker = (id, name) => {
  return { id, name };
};

const countryName = [
  "台北",
  "新北",
  "桃園",
  "台中",
  "台南",
  "高雄",
  "基隆",
  "新竹",
  "嘉義",
  "雲林",
  "彰化",
  "宜蘭",
];

const setCountry = [];

for (let i = 1; i < 13; i++) {
  setCountry.push(countryMaker(`${i}`, countryName[i - 1]));
}
// console.log(setCountry);

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
      `${i}`,
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

// =============== express id ===============
const expressIdMaker = (id, name) => {
  return { id, name };
};

const expressName = ["低溫配送", "常溫配送", "店取"];

const setExpressId = [];

for (let i = 1; i < 4; i++) {
  setExpressId.push(expressIdMaker(`${i}`, expressName[i - 1]));
}
// console.log(setExpressId);

// =============== 產品 * 100 ===============
const productMaker = (
  id,
  name,
  price,
  description,
  express_id,
  created_at,
  valid
) => {
  return { id, name, price, description, express_id, created_at, valid };
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
      new Date(),
      1
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

// =============== payment ===============
const paymentMaker = (id, name) => {
  return { id, name };
};

const paymentName = ["信用卡", "現金(貨到付款)", "現金(店取)"];

const payment = [];

for (let i = 1; i < paymentName.length + 1; i++) {
  payment.push(paymentMaker(i, paymentName[i - 1]));
}
// console.log(payment);

// =============== orderStatus ===============
const orderStatusMaker = (id, name) => {
  return { id, name };
};

const orderStatusName = ["收到訂單", "製作中", "出貨", "已送達", "取消訂單"];

const orderStatus = [];

for (let i = 1; i < orderStatusName.length + 1; i++) {
  orderStatus.push(orderStatusMaker(i, orderStatusName[i - 1]));
}
// console.log(orderStatus);

// =============== order_info * 100 ===============

const orderInfoMaker = (
  id,
  user_id,
  order_status_id,
  address,
  payment_id,
  timestamp
) => {
  return { id, user_id, order_status_id, address, payment_id, timestamp };
};

const randomUserId = () => Math.ceil(Math.random() * 10);
const randomOrderStatusId = () =>
  Math.ceil(Math.random() * orderStatusName.length);
const addressStr = () => Math.random().toString(36).substr(2);
const randomPaymentId = () => Math.floor(Math.random() * 2) + 1;

const order_info = [];

for (let i = 1; i <= 100; i++) {
  order_info.push(
    orderInfoMaker(
      i,
      randomUserId(),
      randomOrderStatusId(),
      addressStr(),
      randomPaymentId(),
      new Date()
    )
  );
}

// console.log(order_info);

// =============== coupon * 10 ===============
const couponMacker = (
  id,
  name,
  code,
  discount,
  start_date,
  end_date,
  limited
) => {
  return { id, name, code, discount, start_date, end_date, limited };
};

const couponName = () => Math.random().toString(36).substr(2);
const couponCode = () => Math.random().toString(36).substr(2);
const discount = () => Math.ceil(Math.random() * 10) * 20;
const limited = () => Math.floor(Math.random() * 5) + 1;

const coupons = [];

for (let i = 1; i <= 10; i++) {
  coupons.push(
    couponMacker(
      i,
      couponName(),
      couponCode(),
      discount(),
      new Date(),
      new Date(),
      limited()
    )
  );
}

// console.log(coupons);

// =============== order_product * 200 ===============
const orderProductMacker = (
  id,
  order_info_id,
  product_id,
  coupon_id,
  memo,
  price
) => {
  return { id, order_info_id, product_id, coupon_id, memo, price };
};

const randomOrderInfoId = () => Math.ceil(Math.random() * 100);
const randomProductId = () => Math.ceil(Math.random() * 100);
const randomCouponId = () => Math.ceil(Math.random() * 10);
const memo = () => Math.random().toString(36).substr(2);

const orderProduct = [];

for (let i = 1; i <= 150; i++) {
  orderProduct.push(
    orderProductMacker(
      i,
      randomOrderInfoId(),
      randomProductId(),
      randomCouponId(),
      memo(),
      varPrice()
    )
  );
}

// console.log(orderProduct);

// ========================================

module.exports = {
  setGender,
  setCountry,
  users,
  setExpressId,
  products,
  lessons,
  likedLesson,
  likedProduct,
  payment,
  orderStatus,
  order_info,
  coupons,
  orderProduct,
};

// 亂數選字的方法 (參考)
// const list = ["a","b","c"]
// list[Math.random()]
