import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// pinia persist
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

export * from "./modules/homeStore";
export * from "./modules/userStore";
export * from "./modules/momentStore";
export * from "./modules/detailStore";
export * from "./modules/commentStore";
export * from "./modules/questionStore";
export * from "./modules/articleStore";
export * from "./modules/announcementStore";
