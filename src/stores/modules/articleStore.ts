import { defineStore } from "pinia";
import {
  fetchArticleList,
  fetchCreateArticle,
  fetchRemoveArticle,
  fetchArticleDetail,
  fetchArticleComment,
  fetchSendArticleComment,
  fetchRemoveArticleComment,
  fetchLikeArticleComment
} from "@/service";
import listToTree from "../../utils/listToTree";
import dayjs from "dayjs";

interface articleInterface {
  articles: any[];
  articleOffset: number;
  articleTotalCount: number;
  pagenum: number;
  articleDetail: any;
  commentsTree: any;
  commentTotal: any;
}

export const useArticleStore = defineStore("article", {
  state: (): articleInterface => {
    return {
      articles: [],
      articleOffset: 0,
      articleTotalCount: 0,
      pagenum: 1,
      articleDetail: null,
      commentsTree: "",
      commentTotal: 0
    };
  },
  actions: {
    // 获取动态列表
    async getArticleList(params: { pagenum: number; pagesize: number; username?: string }) {
      try {
        const { data } = await fetchArticleList(params);
        const formattedList: any[] = [];
        data.list.forEach(item => {
          formattedList.push({
            ...item,
            createTime: dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
          });
        });

        // 如果是删除操作，则直接赋值
        if (params.pagenum === 1) {
          this.articles = formattedList;
        } else {
          // 否则是下拉加载，使用 push 方法追加
          this.articles.push(...formattedList);
        }
        this.articleTotalCount = data.total;

        if (params.pagenum >= Math.ceil(data.total / params.pagesize)) {
          return false;
        }
        return true;
      } catch (error) {
        console.error("获取动态列表时出现错误:", error);
        return false;
      }
    },
    // 创建动态(图片)
    async createArticle(formData: any) {
      const res = await fetchCreateArticle(formData);
      if (res.code !== 200) return res.success;
      return res;
    },
    // 创建动态(视频)
    async createArticleVideo(formData: any) {
      const res = await fetchCreateArticle(formData);
      if (res.code !== 200) return res.success;
    },
    // 删除动态
    async removeArticle(id: number) {
      const res = await fetchRemoveArticle(id);
      console.log(res);
      if (res.code !== 200) return res.success;
    },
    // 获取文章
    async getOneArticle(id: number) {
      const { data } = await fetchArticleDetail(id);
      data.createTime = dayjs(data.createTime).format("YYYY-MM-DD HH:mm");
      this.articleDetail = data;
    },
    // 获取评论
    async getArticleComment(id: number) {
      const { data } = await fetchArticleComment(id);
      for (const item of data.data) {
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
        item.content = item.content.replace(/\n/g, "<br>");
      }
      this.commentsTree = listToTree(data.data);
      console.log(this.commentsTree);

      this.commentTotal = data.total;
    },
    // 创建评论
    async createArticleComment(momentId: number, content: string, replyId: string | null = null) {
      const result = await fetchSendArticleComment(Number(momentId), content, replyId);
      if (result.code !== 200) return result.success;
    },
    // 删除评论
    async removeArticleComment(id: string) {
      const result = await fetchRemoveArticleComment(id);
      if (result.code !== 200) return result.success;
    },
    // 点赞
    async likeArticleComment(id: number) {
      const result = await fetchLikeArticleComment(id);
      if (result.code !== 200) return result.success;
    }
  }
});
