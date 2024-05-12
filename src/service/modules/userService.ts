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
export function fetchUser(id: string) {
  return cmsService.request({
    url: `/user/${id}`,
    method: "get"
  });
}

// 更新用户信息
export function fetchUpdateUser(id: string, formData: any) {
  return cmsService.request({
    url: `/user/update/${id}`,
    method: "patch",
    data: formData
  });
}

// 修改密码
export function fetchUpdatePassword(data: { newPassword: string; password: string }) {
  return cmsService.request({
    url: `/user/update-password`,
    method: "post",
    data
  });
}

// 关注用户
export function fetchFollowUser(id: string) {
  return cmsService.request({
    url: `/user/follow-user/${id}`,
    method: "post"
  });
}

// 关注列表
export function fetchFollowList(id: string, params: { pagenum: number; pagesize: number }) {
  return cmsService.request({
    url: `/user/following/${id}`,
    method: "get",
    params
  });
}
