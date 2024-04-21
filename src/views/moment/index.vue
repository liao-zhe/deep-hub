<script setup>
import { ref } from "vue";
import momenList from "./components/momenList.vue";
import slidebarView from "../../components/slidebar/sidebar-view.vue";
import userlistView from "../../components/userlist/userlist-view.vue";
import "@arco-design/web-vue/es/message/style/css.js";
import { useMomentStore, useHomeStore } from "@/stores";
import { storeToRefs } from "pinia";
const momentStore = useMomentStore();
const homeStore = useHomeStore();

const { moments } = storeToRefs(momentStore);
// 控制loading的显示和隐藏
const isShowLoading = ref(true);
const loadMomentHandler = async payload => {
  momentStore.pagenum = 1;
  const res = await momentStore.getMomentList({ pagenum: momentStore.pagenum++, pagesize: payload.pagesize });
  // 当res为false表示所有数据都查询出来了，此时要关闭观察器，并隐藏loading
  if (res === false) {
    // 当没有更多数据可加载时，停止下拉加载
    payload.observer.disconnect();
    isShowLoading.value = false;
  }
};
</script>

<template>
  <div class="moment">
    <div class="moment-container">
      <slidebar-view />
      <momen-list :moments="moments" :is-show-loading="isShowLoading" @load-moment="loadMomentHandler"></momen-list>
      <userlist-view :users="homeStore.users" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moment {
  min-height: calc(100vh - 58px);
  background-color: var(--theme-bg2);
  .moment-container {
    display: flex;
    max-width: 1200px;
    padding: 20px 0;
    margin: 0 auto;
  }
}
</style>
