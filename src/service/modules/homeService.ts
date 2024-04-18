import { cmsService } from "../request/config";

export function fetchUserList(pagenum: number, pagesize: number, gender: number) {
  return cmsService.request({
    method: "get",
    url: "/user/list",
    params: { pagenum, pagesize, gender }
  });
}
