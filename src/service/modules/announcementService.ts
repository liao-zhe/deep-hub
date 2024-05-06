import { cmsService } from "../request/config";

export function fetchAnnouncementList(params: {
  pagenum: number;
  pagesize: number;
  title?: string;
  username?: string;
  content?: string;
}) {
  return cmsService.request({
    url: "/announcement/list",
    method: "get",
    params
  });
}
