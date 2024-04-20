import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";
import { fetchUser, fetchUpdateUser } from "@/service";
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
    // 置空用户信息
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    // 获取用户信息
    async getUserInfo(id: string) {
      const res = await fetchUser(id);
      if (res.code !== 200) return res.success;
      this.userInfo = res.data;
    },
    // 更新用户信息
    async updateUser(formData: any) {
      const res = await fetchUpdateUser(formData);
      if (res.code !== 200) return res.success;
    }
  },
  persist: piniaPersistConfig("user")
});
