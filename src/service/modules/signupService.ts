import { authService } from "../request/config";

// 注册用户
export function fetchSignupUser(data: {
  username: string;
  password: string;
  nickname: string;
  email: string;
  uuid: string;
  verificationCode: string;
}) {
  return authService.request({
    url: "/auth/signup",
    method: "post",
    data
  });
}

// 校验用户名
export function fetchVerifyUsername(username: string) {
  return authService.request({
    url: `/auth/user-is-exist/:user`,
    method: "post",
    params: { user: username }
  });
}

// 校验邮箱
export function fetchVerifyEmail(email: string) {
  return authService.request({
    url: `auth/email-is-exist/:email`,
    method: "post",
    params: { email }
  });
}

// 校验验证码
export function fetchVerifyCode(data: { email: string; verificationCode: string; uuid: string }) {
  return authService.request({
    url: `auth/check-verification-code`,
    method: "post",
    data
  });
}
