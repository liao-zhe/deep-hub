import { defineStore } from "pinia";
import { fetchComment, fetchSendComment, fetchRemoveComment } from "@/service";
import listToTree from "../../utils/listToTree";
import dayjs from "dayjs";

interface commentState {
  commentList: any[];
  commentTotal: number;
}

export const useCommentStore = defineStore("comment", {
  state: (): commentState => {
    return {
      commentList: [],
      commentTotal: 0
    };
  },
  actions: {
    // 获取评论
    async getComment(id: number) {
      const { data } = await fetchComment(id);
      for (const item of data.data) {
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
      }
      for (const item of data.data.user) {
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
      }
      if (data.data.length === 0) return false;
      this.commentList = listToTree(data.data);
      this.commentTotal = data.total;
    },
    // 创建评论
    async createComment(momentId: number, content: string, replayId: number | null = null) {
      const result = await fetchSendComment(momentId, content, replayId);
      if (result.code !== 200) return result.success;
    },
    // 删除评论
    async removeComment(id: number) {
      const result = await fetchRemoveComment(id);
      if (result.code !== 200) return result.success;
    }
  }
});
