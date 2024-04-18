import { defineStore } from "pinia";
import { fetchMomentDetail } from "@/service";
import dayjs from "dayjs";

interface detailState {
  momentDetail: { [key: string]: any };
}

export const useDetailStore = defineStore("detail", {
  state: (): detailState => {
    return { momentDetail: {} };
  },
  actions: {
    async getMomentList(id: number) {
      const { data } = await fetchMomentDetail(id);
      for (const key in data) {
        data.createTime = dayjs(data.createTime).format("YYYY-MM-DD HH:mm");
      }
      this.momentDetail = data;
      if (!data) return null;
    }
  }
});
