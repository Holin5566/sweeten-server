const Joi = require("joi");

const rules = {
  name: Joi.string().required(),
  email: Joi.string().email().trim().required(), // 限定email格式並移除多餘空白
  password: Joi.string()
    .regex(/[a-zA-Z0-9]{6,30}$/)
    .required(), // 最小長度6最大30，只允許英文大小寫和數字
  phone: Joi.string().regex(/^09[0-9]{8}$/), // 字串+手機格式+必填
};

module.exports = {
  login: Rule({
    email: rules.email,
    password: rules.password,
  }),
  signup: Rule({
    name: rules.name,
    email: rules.email,
    password: rules.password,
    phone: rules.phone,
  }),
};

function Rule(rules) {
  return (data) => {
    const error = Joi.object(rules)
      .validate(data)
      .error?.message?.split('"')[1];
    return {
      error,
      msg: `${error}:無效輸入`,
    };
  };
}
