// 登录表单校验规则
const formRules = {
  usernameRule: [
    { required: true, message: "请填写账号" },
    { minLength: 3, message: "账号错误" }
  ],
  passwordRule: [
    { required: true, message: "请填写密码" },
    { minLength: 3, message: "密码错误" }
  ],
  emailRule: [{ required: true, message: "请填写邮箱" }],
  codeRule: [{ required: true, message: "请填写验证码" }]
};

// 解构导出，并对属性重命名
export const { usernameRule, passwordRule, emailRule, codeRule } = formRules;
