import axios from "axios";
import { Message } from "@arco-design/web-vue";
import { useUserStore } from "@/stores";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import router from "@/router";

interface myAxiosRequestConfig extends AxiosRequestConfig {
  interceptors?: {
    requestOnFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
    requestOnRejected?: (err: any) => any;
    responseOnFulfilled?: (config: AxiosResponse) => AxiosResponse;
    responseOnRejected?: (err: any) => any;
  };
}
class Service {
  instance: AxiosInstance;
  constructor(config: myAxiosRequestConfig) {
    this.instance = axios.create(config);
    // 每个实例都添加拦截器
    this.instance.interceptors.request.use(
      config => {
        const userStore = useUserStore();
        if (config.headers && typeof config.headers.set === "function") {
          config.headers.set("authorization", "Bearer " + userStore.token);
        }
        console.log("全局请求成功的拦截");
        return config;
      },
      err => {
        console.log("全局请求失败的拦截");
        return err;
      }
    );
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        const userStore = useUserStore();
        // 登录失效
        if (data.code == 401) {
          userStore.setToken("");
          router.replace("/login");
          Message.error(data.message);
          return Promise.reject(data);
        }
        if (data.code && data.code !== 200) {
          Message.error(data.message);
          return Promise.reject(data);
        }
        return data;
      },
      err => {
        Message.error("服务器异常");
        return Promise.reject(err);
      }
    );
    // 给实例添加拦截器
    this.instance.interceptors.request.use(config.interceptors?.requestOnFulfilled, config.interceptors?.requestOnRejected);
    this.instance.interceptors.response.use(config.interceptors?.responseOnFulfilled, config.interceptors?.responseOnRejected);
  }
  request(config: AxiosRequestConfig) {
    return this.instance.request(config);
  }
  get() {}
  post() {}
}

export default Service;
