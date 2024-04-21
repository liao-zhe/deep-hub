import { defineStore } from "pinia";
import { fetchMomentList, fetchCreateMomentImages, fetchCreateMomentVideo, fetchRemoveMoment } from "@/service";
import dayjs from "dayjs";

interface momentInterface {
  moments: any[];
  momentOffset: number;
  momentTotalCount: number;
  pagenum: number;
}

export const useMomentStore = defineStore("moment", {
  state: (): momentInterface => {
    return {
      moments: [],
      momentOffset: 0,
      momentTotalCount: 0,
      pagenum: 1
    };
  },
  actions: {
    // 获取动态列表
    async getMomentList(params: { pagenum: number; pagesize: number; username?: string }) {
      try {
        const { data } = await fetchMomentList(params);
        const formattedList: any[] = [];
        data.list.forEach(item => {
          formattedList.push({
            ...item,
            createTime: dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
          });
        });

        // 如果是删除操作，则直接赋值
        if (params.pagenum === 1) {
          this.moments = formattedList;
        } else {
          // 否则是下拉加载，使用 push 方法追加
          this.moments.push(...formattedList);
        }
        this.momentTotalCount = data.total;

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
    async createMoment(formData: any) {
      const res = await fetchCreateMomentImages(formData);
      if (res.code !== 200) return res.success;
    },
    // 创建动态(视频)
    async createMomentVideo(formData: any) {
      const res = await fetchCreateMomentVideo(formData);
      if (res.code !== 200) return res.success;
    },
    // 删除动态
    async removeMoment(id: number) {
      const res = await fetchRemoveMoment(id);
      console.log(res);
      if (res.code !== 200) return res.success;
    }
  }
});
