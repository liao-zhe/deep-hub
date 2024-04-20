import { defineStore } from "pinia";
import { fetchArticleList, fetchCreateArticle, fetchRemoveArticle } from "@/service";
import dayjs from "dayjs";

interface articleInterface {
  articles: any[];
  articleOffset: number;
  articleTotalCount: number;
  pagenum: number;
}

export const useArticleStore = defineStore("article", {
  state: (): articleInterface => {
    return {
      articles: [],
      articleOffset: 0,
      articleTotalCount: 0,
      pagenum: 1
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
            createAt: dayjs(item.createAt).format("YYYY-MM-DD HH:mm")
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
    }
  }
});
