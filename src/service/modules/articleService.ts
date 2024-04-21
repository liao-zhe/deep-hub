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

// 获取某个文章的所有评论
export function fetchArticleComment(id: number) {
  return cmsService.request({
    method: "get",
    url: `/article-comment/${id}`
  });
}

// 创建评论
export function fetchSendArticleComment(articleId: number, content: string, replyId: string | null = null) {
  return cmsService.request({
    method: "post",
    url: `/article-comment/create`,
    data: {
      articleId,
      content,
      replyId
    }
  });
}
//删除评论
export function fetchRemoveArticleComment(id: string) {
  return cmsService.request({
    method: "delete",
    url: `/article-comment/delete/${id}`
  });
}

// 切换点赞
export function fetchLikeArticleComment(id: string) {
  return cmsService.request({
    method: "post",
    url: `/article-comment/toggle-likes/${id}`
  });
}
