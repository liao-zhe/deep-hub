import { defineStore } from "pinia";
import { fetchMomentDetail } from "@/service";
import dayjs from "dayjs";

interface detailState {
  momentDetail: any;
}

export const useDetailStore = defineStore("detail", {
  state: (): detailState => {
    return { momentDetail: "" };
  },
  actions: {
    // 获取动态
    async getOneMoment(id: number) {
      const { data } = await fetchMomentDetail(id);
      data.createTime = dayjs(data.createTime).format("YYYY-MM-DD HH:mm");
      this.momentDetail = data;
    }
  }
});
