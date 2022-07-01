import Joi from "joi";

export default {
  /* ------------------------- POST /api/auth/login ------------------------ */
  userLogin: {
    body: {
      email: Joi.string().email().trim().required(), // 限定email格式並移除多餘空白
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{6,30}$/)
        .required(), // 最小長度6最大30，只允許英文大小寫和數字
    },
  },
  /* ------------------------- POST /api/auth/email ------------------------ */
  createUser: {
    body: {
      name: Joi.string().required(), // 字串＋必填
      email: Joi.string().email().trim().required(), // 限定email格式並移除多餘空白
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{6,30}$/)
        .required(), // 最小長度6最大30，只允許英文大小寫和數字
      phone: Joi.string()
        .regex(/^09[0-9]{8}$/)
        .required(), // 字串+手機格式+必填
    },
  },
};
