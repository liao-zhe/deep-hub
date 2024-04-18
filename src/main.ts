import { createApp } from "vue";
import pinia from "@/stores";
import App from "./App.vue";
import router from "./router";

import "./assets/global.css";
// 额外引入图标库
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
//导入提示框需要的css
import "@arco-design/web-vue/es/notification/style/css.js";
import "@arco-design/web-vue/es/message/style/css.js";

const app = createApp(App);

app.use(pinia);
app.use(ArcoVueIcon);
app.use(router);
app.mount("#app");
