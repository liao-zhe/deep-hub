import { cmsService } from "../request/config";

// 创建问题
export function fetchCreateQuestion(data: { content: string; userId: number }) {
  return cmsService.request({
    url: "/question-answer/create-question",
    method: "post",
    data
  });
}

// 创建回答
export function fetchCreateAnswer(id: number, data: { content: string; questionId: number; userId: number }) {
  return cmsService.request({
    url: `/question-answer/create-answer/${id}`,
    method: "post",
    data
  });
}

// 查询问题列表
export function fetchQuestionList(params: {
  pagenum: number;
  pagesize: number;
  username?: string;
  content?: string;
  keywords?: string;
  labelId?: string;
  category?: string;
  sortMode?: string;
}) {
  return cmsService.request({
    url: "/question-answer/question/list",
    method: "get",
    params
  });
}

// 查询某个问题
export function fetchOneQuestion(id: string) {
  return cmsService.request({
    url: `/question-answer/question/${id}`,
    method: "get"
  });
}

// 删除问题
export function fetchRemoveQuestion(id: string) {
  return cmsService.request({
    url: `/question-answer/question/${id}`,
    method: "delete"
  });
}

// 删除答案
export function fetchRemoveAnswer(id: string) {
  return cmsService.request({
    url: `/question-answer/answer/${id}`,
    method: "delete"
  });
}

// 答案列表
export function fetchAnswerList(
  id: string,
  params: {
    pagenum: number;
    pagesize: number;
    username?: string;
    content?: string;
    keywords?: string;
    labelId?: string;
    category?: string;
    sortMode?: string;
  }
) {
  return cmsService.request({
    url: `/question-answer/answer/${id}`,
    method: "get",
    params
  });
}
