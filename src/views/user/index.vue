<script setup>
// import { onMounted } from 'vue'
// 导入particlesjs
// import Particles from 'particlesjs'
// 子组件
import { ref } from "vue";
import userCard from "./components/user-card.vue";
import userContent from "./components/user-content.vue";
import { useUserStore, useMomentStore, useArticleStore } from "@/stores";
// 当前路由
import { useRoute } from "vue-router";
const route = useRoute();
// pinia
import { storeToRefs } from "pinia";
// arco-design
import { Message } from "@arco-design/web-vue";

const userStore = useUserStore();
const momentStore = useMomentStore();
const articleStore = useArticleStore();
const { moments } = storeToRefs(momentStore);
const { articles } = storeToRefs(articleStore);
const isShowLoading = ref(true);
userStore.getUserInfo(route.query.id);
const { token, userInfo, otherUserInfo } = storeToRefs(userStore);
console.log(userInfo);
// 获取动态列表
// const loadMomentHandler = async payload => {
//   const res = await momentStore.getMomentList({
//     pagenum: payload.pagenum,
//     pagesize: payload.pagesize,
//     username: payload.username
//   });
//   if (res === false) {
//     // 当没有更多数据可加载时，停止下拉加载
//     payload.observer.disconnect();
//     isShowLoading.value = false;
//   }
// };

// // 获取文章列表
// const loadArticleHandler = async payload => {
//   const res = await articleStore.getArticleList({
//     pagenum: payload.pagenum,
//     pagesize: payload.pagesize,
//     username: payload.username
//   });
//   if (res === false) {
//     // 当没有更多数据可加载时，停止下拉加载
//     payload.observer.disconnect();
//     isShowLoading.value = false;
//   }
// };
momentStore.getMomentList({
  pagenum: 1,
  pagesize: 40,
  username: route.query.username
});
articleStore.getArticleList({
  pagenum: 1,
  pagesize: 40,
  username: route.query.username
});
// 创建动态
const createMomentHandler = async payload => {
  const res = await momentStore.createMoment(payload);
  if (res) return Message.error("动态发布失败");
  Message.success("动态发布成功");
  await momentStore.getMomentList({ pagenum: 1, pagesize: 10, username: route.query.username });
};

// 删除动态
const removeMomentHandler = async id => {
  const res = await momentStore.removeMoment(id);
  if (!res) {
    Message.success("动态删除成功");
    await momentStore.getMomentList({ pagenum: 1, pagesize: 10, username: route.query.username });
  } else {
    Message.error("动态删除失败");
  }
};

// 删除文章
const removeArticleHandler = async id => {
  const res = await articleStore.removeArticle(id);
  if (!res) {
    Message.success("文章删除成功");
    await articleStore.getArticleList({ pagenum: 1, pagesize: 10, username: route.query.username });
  } else {
    Message.error("文章删除失败");
  }
};
// Particles.resumeAnimation()
// onMounted(() => {
//   Particles.init({
//     selector: '#bg',
//     color: ['#165dff', '#165dff'],
//     sizeVariations: 3,
//     connectParticles: true,
//     minDistance: 100
//   })
//   // Particles.pauseAnimation()
// })
</script>

<template>
  <div class="user-view">
    <div class="user-container">
      <user-card v-if="otherUserInfo" :current-user="otherUserInfo" :token="token" :user-info="userInfo"></user-card>
      <user-content
        v-if="moments || articles"
        :moments="moments"
        :articles="articles"
        @create-moment="createMomentHandler"
        @remove-moment="removeMomentHandler"
        @remove-article="removeArticleHandler"
        @load-moment="loadMomentHandler"
        @load-article="loadArticleHandler"
        :is-show-loading="isShowLoading"
      ></user-content>
    </div>
    <!-- <canvas id="bg"></canvas> -->
  </div>
</template>

<style lang="scss" scoped>
#bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -2;
  background-color: var(--theme-bg2);
}
.user-view {
  background-color: var(--theme-bg2);
  min-height: calc(100vh - 58px);
  padding: 20px 0;
  .user-container {
    margin: 0 auto;
    max-width: 1200px;
  }
}
</style>
