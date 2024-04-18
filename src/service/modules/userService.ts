import { authService } from "../request/config";

// 用户登录
export function fetchLogin(data: { username: string; password: string }) {
  return authService.request({
    url: "/auth/signin",
    method: "post",
    data
  });
}

// 获取验证码
export function fetchGetCode(email: any) {
  return authService.request({
    url: `/auth/email-verify-code/${email}`,
    method: "post"
  });
}

// 验证码登录
export function fetchCodeLogin(data: { email: string; verificationCode: string; uuid: string }) {
  return authService.request({
    url: "/auth/signin-verification-code",
    method: "post",
    data
  });
}

// 获取用户信息
export function fetchUser(username: string) {
  return authService.request({
    url: `/user/${username}`,
    method: "get"
  });
}

// export function fetchEmialVerifyCode(email: string) {
//   return authService.request({
//     url: `/sendEmail`,
//     method: "post",
//     data: {
//       email
//     }
//   });
// }

export function fetchEmailVerifyLogin(email: string, code: number) {
  return authService.request({
    url: `/loginVerifyCode`,
    method: "post",
    data: {
      email,
      code
    }
  });
}

export function fetchUpdateUser(user: any) {
  return authService.request({
    url: `/user`,
    method: "put",
    data: {
      ...user
    }
  });
}
