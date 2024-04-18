import { cmsService } from "../request/config";

// 创建动态(图片)
export function fetchCreateMomentImages(formData: any) {
  return cmsService.request({
    url: "/moment/images",
    method: "post",
    data: formData
  });
}

// 创建动态（视频）
export function fetchCreateMomentVideo(formData: any) {
  return cmsService.request({
    url: "/moment/video",
    method: "post",
    body: formData
  });
}

// 删除动态
export function fetchRemoveMoment(id: number) {
  return cmsService.request({
    url: `/moment/delete/${id}`,
    method: "delete"
  });
}
// 获取动态列表
export function fetchMomentList(params: {
  pagenum: number;
  pagesize: number;
  keywords?: string;
  content?: string;
  labelId?: string;
  category?: string;
  username?: string;
}) {
  return cmsService.request({
    method: "get",
    url: "/moment/list",
    params
  });
}

// 获取某条动态
export function fetchMomentDetail(id: number) {
  return cmsService.request({
    method: "get",
    url: `/moment/${id}`
  });
}

// 动态点赞
export function fetchLikeMoment(id: number) {
  return cmsService.request({
    method: "post",
    url: `/moment/toggle-likes/${id}`
  });
}
