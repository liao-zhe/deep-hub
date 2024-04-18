import { cmsService } from "../request/config";

// 获取某个动态的所有评论
export function fetchComment(id: number) {
  return cmsService.request({
    method: "get",
    url: `/moment-comment/${id}`
  });
}
export function fetchSendComment(momentId: number, content: string, replayId: number | null = null) {
  return cmsService.request({
    method: "post",
    url: `/moment-comment/`,
    data: {
      momentId,
      content,
      replayId
    }
  });
}
//
export function fetchRemoveComment(id: number) {
  return cmsService.request({
    method: "delete",
    url: `/moment-comment/${id}`
  });
}

// 点赞
