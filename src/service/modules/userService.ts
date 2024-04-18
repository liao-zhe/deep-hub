import { authService, cmsService } from "../request/config";

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
export function fetchUser(id: number) {
  return cmsService.request({
    url: `/user/${id}`,
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
