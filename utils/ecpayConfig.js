require("dotenv").config();

const options = {
  OperationMode: "Test", //Test or Production
  MercProfile: {
    MerchantID: "2000132",
    HashKey: "5294y06JbISpM5x9",
    HashIV: "v77hoKGq4kWxNNIS",
  },
  IgnorePayment: [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
  ],
  IsProjectContractor: false,
};

const newOrder = (orderState) => {
  const current = new Date();
  const timestamp = current.getTime().toString();
  const twoChars = (time) => ("0" + time).slice(-2);
  const formatTime = (date) =>
    `${date.getFullYear()}/` +
    `${twoChars(date.getMonth())}/` +
    `${twoChars(date.getDate())} ` +
    `${twoChars(date.getHours())}:` +
    `${twoChars(date.getMinutes())}:` +
    `${twoChars(date.getSeconds())}`;

  const base_param = {
    ...orderState,
    MerchantTradeNo: "sweeten" + timestamp, //post //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: formatTime(current), //post  //ex:2017/02/13 15:45:30
    ReturnURL: process.env.LOCAL_URL + "/api/ecpay",
    OrderResultURL: process.env.LOCAL_URL + "/api/ecpay/sucess",
  };
  return base_param;
};

module.exports = { options, newOrder };
