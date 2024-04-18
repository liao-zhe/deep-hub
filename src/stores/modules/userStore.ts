import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";
import { fetchUser } from "@/service";
export interface UserState {
  token: string;
  verifyLogin: boolean;
  userInfo: {};
}
export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: "",
    verifyLogin: false,
    userInfo: {}
  }),
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    async getUserInfo(id: string) {
      const res = await fetchUser(id);
      if (res.code !== 200) return res.success;
      this.userInfo = res.data;
    }
  },
  persist: piniaPersistConfig("user")
});
