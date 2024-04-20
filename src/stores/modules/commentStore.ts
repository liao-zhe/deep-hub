import { defineStore } from "pinia";
import { fetchComment, fetchSendComment, fetchRemoveComment, fetchLikeComment } from "@/service";
import listToTree from "../../utils/listToTree";
import dayjs from "dayjs";

interface commentState {
  commentsTree: any;
  commentTotal: number;
}

export const useCommentStore = defineStore("comment", {
  state: (): commentState => {
    return {
      commentsTree: "",
      commentTotal: 0
    };
  },
  actions: {
    // 获取评论
    async getComment(id: number) {
      const { data } = await fetchComment(id);
      for (const item of data.data) {
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
        item.content = item.content.replace(/\n/g, "<br>");
      }
      this.commentsTree = listToTree(data.data);
      console.log(this.commentsTree);

      this.commentTotal = data.total;
    },
    // 创建评论
    async createComment(momentId: number, content: string, replyId: string | null = null) {
      const result = await fetchSendComment(Number(momentId), content, replyId);
      if (result.code !== 200) return result.success;
    },
    // 删除评论
    async removeComment(id: string) {
      const result = await fetchRemoveComment(id);
      if (result.code !== 200) return result.success;
    },
    // 点赞
    async likeComment(id: number) {
      const result = await fetchLikeComment(id);
      if (result.code !== 200) return result.success;
    }
  }
});
