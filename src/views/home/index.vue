<script setup>
import { ref } from "vue";
import "@arco-design/web-vue/es/message/style/css.js";
// import { Message } from '@arco-design/web-vue'
import sidebarView from "../../components/slidebar/sidebar-view.vue";
import articleList from "./components/article-list.vue";
import userlistView from "../../components/userlist/userlist-view.vue";
import { useHomeStore, useArticleStore, useAnnouncementStore } from "@/stores";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
const route = useRoute();
const homeStore = useHomeStore();
const articleStore = useArticleStore();
const announcementStore = useAnnouncementStore();
announcementStore.getAnnouncementList({ pagenum: 1, pagesize: 10 });
homeStore.getUserList(1, 10);
const { articles } = storeToRefs(articleStore);
console.log(articles.value);
// 控制loading的显示和隐藏
const isShowLoading = ref(true);
const loadArticleHandler = async payload => {
  articleStore.pagenum = 1;
  let params = route.query.search
    ? { pagenum: articleStore.pagenum++, pagesize: payload.pagesize, title: route.query.search }
    : { pagenum: articleStore.pagenum++, pagesize: payload.pagesize };
  const res = await articleStore.getArticleList(params);
  // 当res为false表示所有数据都查询出来了，此时要关闭观察器，并隐藏loading
  console.log(res);
  if (res === false) {
    payload.observer.disconnect();
    isShowLoading.value = false;
  }
};
</script>

<template>
  <div class="home">
    <div class="home-container">
      <sidebar-view />
      <article-list :articles="articles" :is-show-loading="isShowLoading" @load-article="loadArticleHandler" />
      <userlist-view :users="homeStore.users" :announcements="announcementStore.announcements"></userlist-view>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home {
  background-color: var(--theme-bg2);
  min-height: calc(100vh - 58px);
  .home-container {
    max-width: 1200px;
    padding: 20px 0;
    margin: 0 auto;
    display: flex;
  }
}
</style>
