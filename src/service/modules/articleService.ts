import { cmsService } from "../request/config";

// 创建文章
export function fetchCreateArticle(formData: any) {
  return cmsService.request({
    url: "/article/create",
    method: "post",
    data: formData
  });
}

// 删除文章
export function fetchRemoveArticle(id: number) {
  return cmsService.request({
    url: `/article/delete/${id}`,
    method: "delete"
  });
}

// 获取文章列表
export function fetchArticleList(params: {
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
    url: "/article/list",
    params
  });
}

// 获取某条文章
export function fetchArticleDetail(id: number) {
  return cmsService.request({
    method: "get",
    url: `/article/${id}`
  });
}

// 文章点赞
export function fetchLikeArticle(id: number) {
  return cmsService.request({
    method: "post",
    url: `/article/toggle-likes/${id}`
  });
}
