<script setup>
import { ref } from "vue";
import questionList from "./components/questionList.vue";
import slidebarView from "../../components/slidebar/sidebar-view.vue";
import userlistView from "../../components/userlist/userlist-view.vue";
import "@arco-design/web-vue/es/message/style/css.js";

import { useQuestionStore, useHomeStore, useAnnouncementStore } from "@/stores";
import { storeToRefs } from "pinia";
const announcementStore = useAnnouncementStore();
announcementStore.getAnnouncementList({ pagenum: 1, pagesize: 10 });
const questionStore = useQuestionStore();
const homeStore = useHomeStore();

const { questions } = storeToRefs(questionStore);
// 控制loading的显示和隐藏
const isShowLoading = ref(true);
questionStore.pagenum = 1;
const loadQuestionHandler = async payload => {
  const res = await questionStore.getQuestionList({ pagenum: questionStore.pagenum++, pagesize: payload.pagesize });
  // 当res为false表示所有数据都查询出来了，此时要关闭观察器，并隐藏loading
  if (res === false) {
    // 当没有更多数据可加载时，停止下拉加载
    payload.observer.disconnect();
    isShowLoading.value = false;
  }
};
</script>

<template>
  <div class="home">
    <div class="home-container">
      <slidebar-view />
      <question-list @load-question="loadQuestionHandler" :is-show-loading="isShowLoading" :questions="questions"></question-list>
      <userlist-view :users="homeStore.users" :announcements="announcementStore.announcements" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  min-height: calc(100vh - 58px);
  background-color: var(--theme-bg2);
  .home-container {
    display: flex;
    max-width: 1200px;
    padding: 20px 0;
    margin: 0 auto;
  }
}
</style>
