/**
 * Created by ying.wu on 2017/6/27.
 */
const ecpay_payment = require("../lib/ecpay_payment.js");
//參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
//若要測試非必帶參數請將base_param內註解的參數依需求取消註解 //

const base_param = require("../utils/ecpayConfig").base_param;
const inv_params = require("../utils/ecpayConfig").inv_params;
const options = require("../utils/ecpayConfig").options,
  create = new ecpay_payment(options),
  htm = create.payment_client.aio_check_out_all(base_param, inv_params);
