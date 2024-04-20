import { defineStore } from "pinia";
import { fetchUserList } from "@/service";

interface homeInterface {
  users: any[];
}

export const useHomeStore = defineStore("home", {
  state: (): homeInterface => ({
    users: []
  }),
  actions: {
    async getUserList(pagenum: number, pagesize: number, gender?: number) {
      const res = await fetchUserList(pagenum, pagesize, gender);
      this.users = res.data.list;
    }
  }
});
