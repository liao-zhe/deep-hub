<script setup>
// import { onMounted } from 'vue'
// 导入particlesjs
// import Particles from 'particlesjs'
// 子组件
import { ref } from "vue";
import userCard from "./components/user-card.vue";
import userContent from "./components/user-content.vue";
import { useUserStore } from "@/stores";
import { useMomentStore } from "@/stores";
// 当前路由
import { useRoute } from "vue-router";
const route = useRoute();
// pinia
import { storeToRefs } from "pinia";
// arco-design
import { Message } from "@arco-design/web-vue";

const userStore = useUserStore();
const momentStore = useMomentStore();
const { moments } = storeToRefs(momentStore);
const isShowLoading = ref(true);
const { token, userInfo } = storeToRefs(userStore);
// 获取动态列表
const loadMomentHandler = async payload => {
  const res = await momentStore.getMomentList({
    pagenum: payload.pagenum,
    pagesize: payload.pagesize,
    username: payload.username
  });
  if (res === false) {
    // 当没有更多数据可加载时，停止下拉加载
    payload.observer.disconnect();
    isShowLoading.value = false;
  }
};

// 创建动态
const createMomentHandler = async payload => {
  const res = await momentStore.createMoment(payload);
  if (res) return Message.error("动态发布失败");
  Message.success("动态发布成功");
  await momentStore.getMomentList({ pagenum: 1, pagesize: 10, username: route.params.username });
};

// 删除动态
const removeMomentHandler = async id => {
  const res = await momentStore.removeMoment(id);
  if (!res) {
    Message.success("动态删除成功");
    await momentStore.getMomentList({ pagenum: 1, pagesize: 10, username: route.params.username });
  } else {
    Message.error("动态删除失败");
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
      <user-card v-if="userInfo" :user="userInfo" :token="token"></user-card>
      <user-content
        v-if="moments"
        :moments="moments"
        @create-moment="createMomentHandler"
        @remove-moment="removeMomentHandler"
        @load-moment="loadMomentHandler"
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
