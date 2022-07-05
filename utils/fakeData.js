const initUser = {
  id: 1,
  full_name: "test_man",
  email: "test_man@gmail.com",
  password: "not_allow",
  created_at: Date.now(),
};

const productCount = 100;
/* --------------------------------- product -------------------------------- */
const name = (i) => "test_item #" + i;
const price = (max) => parseInt(max * Math.random());
const description = () =>
  " 我認為，叔本華曾講過，普通人只想到如何度過時間，有才能的人設法利用時間。這讓我對於看待這個問題的方法有了巨大的改變。所謂點心，關鍵是點心需要如何解讀。";
const express_id = () => parseInt(3 * Math.random()) + 1;

const makeProduct = () => {
  const result = [];
  for (let i = 0; i < productCount; i++) {
    result.push({
      id: i + 1,
      name: name(i),
      price: price(1500),
      description: description(),
      express_id: express_id(),
    });
  }
  return result;
};
/* ---------------------------- product category ---------------------------- */
const types = ["蛋糕", "馬卡龍", "餅乾", "點心", "冰品"];
const favors = ["草莓", "西瓜", "榴槤", "蓮霧"];

const makeTypeCategory = () => {
  const result = [];
  for (let i = 0; i < types.length; i++) {
    let id = `0${i}`.slice(-2);
    result.push({
      id: `1${id}`,
      name: types[i],
    });
  }
  return result;
};
const makeFavorCategory = () => {
  const result = [];
  for (let i = 0; i < favors.length; i++) {
    let id = `0${i}`.slice(-2);
    result.push({
      id: `2${id}`,
      name: favors[i],
    });
  }
  return result;
};
/* --------------------------------- comment -------------------------------- */
const makeComment = () => {
  const result = [];
  for (let i = 0; i < productCount; i++) {
    result.push({
      user_id: 1,
      product_id: i + 1,
      content: "好好吃捏",
      score: parseInt(5 * Math.random()) + 1,
    });
  }
  return result;
};
/* --------------------------------- express -------------------------------- */
const express = ["常溫配送", "低溫配送", "店取"];
const makeExpress = () => [
  { id: 1, name: "常溫配送" },
  { id: 2, name: "低溫配送" },
  { id: 3, name: "店取" },
];
/* ------------------------------- order_state ------------------------------ */
const state = ["取消", "待付款", "待收貨", "完成"];
const makeOrderState = () => state;

/* --------------------------------- order_info --------------------------------- */
const makeOrderInfo = () => {
  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push({
      user_id: 1,
      address: "桃園桃園桃園桃園桃園桃園桃園桃園桃園桃園",
      payment_id: 1,
      order_status_id: state[parseInt(4 * Math.random())],
    });
  }
  return result;
};

/* ------------------------------ order_product ----------------------------- */
const makeOrderProduct = () => {
  const result = [];
  for (let i = 0; i < 100; i++) {
    result.push({
      product_id: i + 1,
      order_info_id: parseInt(10 * Math.random()) + 1,
      memo: parseInt(5 * Math.random()) + 1,
      price: parseInt(10000 * Math.random()),
    });
  }
  return result;
};
/* ---------------------------- product category ---------------------------- */
const makeExpiry = () => {
  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push({
      product_id: i + 1,
      expiry_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      count: parseInt(5 * Math.random()) + 1,
      discount: 60,
    });
  }
  return result;
};

module.exports = {
  makeComment,
  makeExpress,
  makeFavorCategory,
  makeOrderInfo,
  makeOrderProduct,
  makeOrderState,
  makeProduct,
  makeTypeCategory,
  makeExpiry,
};
