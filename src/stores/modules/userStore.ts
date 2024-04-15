import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";
export interface UserState {
  token: string;
  verifyLogin: boolean;
  userInfo: { username: string; avatrt: string; email: string; status: number; level: number; phone: number; major: string };
}
export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: "",
    verifyLogin: false,
    userInfo: { username: "", email: "", avatrt: "", status: 0, level: 0, phone: 0, major: "" }
  }),
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("user")
});
