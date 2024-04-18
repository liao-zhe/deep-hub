import { defineStore } from "pinia";
import { fetchMomentList, fetchUserList } from "@/service";
import dayjs from "dayjs";

interface homeInterface {
  users: any[];
  moments: any[];
  momentOffset: number;
  momentTotalCount: number;
}

export const useHomeStore = defineStore("home", {
  state: (): homeInterface => ({
    users: [],
    moments: [],
    momentOffset: 0,
    momentTotalCount: 0
  }),
  actions: {
    async getMomentList(pagenum: number, pagesize: number) {
      const { data } = await fetchMomentList(pagenum, pagesize);

      // 日期格式化
      console.log(data);
      for (const item of data.list) {
        item.createAt = dayjs(item.createAt).format("YYYY-MM-DD HH:mm");
      }
      if (data.list.length === 0) return false;
      for (const item of data.list) {
        this.moments.push(item);
      }
      this.momentTotalCount = data.total;
    },
    async getUserList(pagenum: number, pagesize: number, gender: number) {
      const res = await fetchUserList(pagenum, pagesize, gender);
      this.users = res.data.list;
    }
  }
});
