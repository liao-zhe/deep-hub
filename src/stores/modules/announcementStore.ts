import { defineStore } from "pinia";
import { fetchAnnouncementList } from "@/service";
import dayjs from "dayjs";

interface announcementI {
  announcements: any[];
  total: number;
}

export const useAnnouncementStore = defineStore("announcement", {
  state: (): announcementI => ({
    announcements: [],
    total: 0
  }),
  actions: {
    async getAnnouncementList(data) {
      const res = await fetchAnnouncementList(data);
      if (res.code !== 200) return res.message;
      for (const item of res.data.list) {
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
      }
      this.announcements = res.data.list[0];
      this.total = res.data.total;
    }
  }
});
