import { defineStore } from "pinia";
import {
  fetchRemoveQuestion,
  fetchRemoveAnswer,
  fetchCreateQuestion,
  fetchCreateAnswer,
  fetchQuestionList,
  fetchOneQuestion,
  fetchAnswerList
} from "@/service";
import dayjs from "dayjs";

interface momentInterface {
  questions: any[];
  momentOffset: number;
  questionTotalCount: number;
  pagenum: number;
  currentQuestion: any;
  isEdit: boolean;
  answerList: any[];
  answerTotalCount: number;
}

export const useQuestionStore = defineStore("question", {
  state: (): momentInterface => {
    return {
      questions: [],
      momentOffset: 0,
      questionTotalCount: 0,
      pagenum: 1,
      currentQuestion: "",
      isEdit: false,
      answerList: [],
      answerTotalCount: 0
    };
  },
  actions: {
    // 创建问题
    async createQuestion(data: { content: string; userId: number }) {
      const res = await fetchCreateQuestion(data);
      if (res.code !== 200) return res.success;
    },
    // 创建答案
    async createAnswer(id: number, data: { content: string; questionId: number; userId: number }) {
      const res = await fetchCreateAnswer(id, data);
      if (res.code !== 200) return res.success;
    },
    // 删除问题
    async removeQuestion(id: string) {
      const res = await fetchRemoveQuestion(id);
      if (data.code !== 200) return data.success;
    },
    // 删除答案
    async removeAnswer(id: string) {
      const res = await fetchRemoveAnswer(id);
      if (res.code !== 200) return res.success;
    },
    //查询问题列表
    async getQuestionList(params: { pagenum: number; pagesize: number; username?: string }) {
      try {
        const { data } = await fetchQuestionList(params);
        const formattedList: any[] = [];
        data.list.forEach(item => {
          formattedList.push({
            ...item,
            createTime: dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
          });
        });

        // 如果是删除操作，则直接赋值
        if (params.pagenum === 1) {
          this.questions = formattedList;
        } else {
          // 否则是下拉加载，使用 push 方法追加
          this.questions.push(...formattedList);
        }
        this.questionTotalCount = data.total;

        if (params.pagenum >= Math.ceil(data.total / params.pagesize)) {
          return false;
        }
        return true;
      } catch (error) {
        console.error("获取问题列表时出现错误:", error);
        return false;
      }
    },
    // 查询答案列表
    async getAnswerList(id: string, params: { pagenum: number; pagesize: number; username?: string }) {
      try {
        const { data } = await fetchAnswerList(id, params);
        const formattedList: any[] = [];
        data.list.forEach(item => {
          formattedList.push({
            ...item,
            createTime: dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
          });
        });

        // 如果是删除操作，则直接赋值
        if (params.pagenum === 1) {
          this.answerList = formattedList;
        } else {
          // 否则是下拉加载，使用 push 方法追加
          this.answerList.push(...formattedList);
        }
        this.answerTotalCount = data.total;

        if (params.pagenum >= Math.ceil(data.total / params.pagesize)) {
          return false;
        }
        return true;
      } catch (error) {
        console.error("获取答案列表时出现错误:", error);
        return false;
      }
    },
    // 查询一个问题
    async getOneQuestion(id: string) {
      const { data } = await fetchOneQuestion(id);

      data.createTime = dayjs(data.createTime).format("YYYY-MM-DD HH:mm");

      if (data) {
        this.currentQuestion = data;
        console.log(this.currentQuestion);
      } else {
        console.error("获取问题详情时出现错误:");
        return false;
      }
    }
  }
});
