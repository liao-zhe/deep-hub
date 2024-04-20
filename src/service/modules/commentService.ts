import { cmsService } from "../request/config";

// 获取某个动态的所有评论
export function fetchComment(id: number) {
  return cmsService.request({
    method: "get",
    url: `/moment-comment/${id}`
  });
}

// 创建评论
export function fetchSendComment(momentId: number, content: string, replyId: string | null = null) {
  return cmsService.request({
    method: "post",
    url: `/moment-comment`,
    data: {
      momentId,
      content,
      replyId
    }
  });
}
//删除评论
export function fetchRemoveComment(id: string) {
  return cmsService.request({
    method: "delete",
    url: `/moment-comment/${id}`
  });
}

// 切换点赞
export function fetchLikeComment(id: string) {
  return cmsService.request({
    method: "post",
    url: `/moment-comment/toggle-likes/${id}`
  });
}
