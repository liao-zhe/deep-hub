<script setup>
import { ref, onMounted, defineEmits } from "vue";
import dayjs from "dayjs";

defineProps({
  articles: {
    type: Object,
    default: () => ({})
  },
  isShowLoading: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(["loadArticle"]);
function loadArticleFn(obj) {
  emits("loadArticle", obj);
}

const loadingRef = ref();
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        loadArticleFn({ pagesize: 15, observer });
      }
    },
    { threshold: 1 }
  );
  observer.observe(loadingRef.value);
});
</script>

<template>
  <div class="content">
    <div v-for="item in articles" :datetime="item.createAt" :key="item.id" class="content-item">
      <div class="" style="display: flex; justify-content: space-between">
        <div style="cursor: pointer">
          <router-link :to="`/articleDetail/${item.id}`">
            <div style="font-size: 20px; font-weight: 800">{{ item.title }}</div>
            <div class="content" style="font-size: 16px">
              {{ item.content }}
            </div>
          </router-link>
          <div style="font-size: 12px; color: #8a919f">
            <router-link
              class="user-nickname"
              target="_blank"
              :to="`/user/${item.user.nickname}/?id=${item.user.id}&username=${item.user.username}`"
            >
              {{ item.user.nickname }}
            </router-link>
            <span style="padding: 0 5px; color: #e1e1e1">|</span>
            <span><icon-eye /> {{ item.viewCount }} </span>
            <span style="padding: 0 5px; color: #e1e1e1">|</span>
            <span>{{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm") }}</span>
          </div>
        </div>
        <div style="text-align: right">
          <div v-if="item.cover">
            <img style="height: 100px" :src="item.cover" alt="" />
          </div>
          <div v-else style="height: 100px"></div>
          发布时间：
          <a-tag style="margin-left: 5px" v-for="(label, index) in item.labels" :key="index">{{ label }}</a-tag>
        </div>
      </div>
      <a-divider />
    </div>

    <div class="loading" ref="loadingRef" v-if="isShowLoading">
      <a-spin dot />
    </div>
    <h3 v-else style="color: var(--color-text-3); text-align: center">
      <icon-info-circle />
      已经加载到底部了
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 60%;
  padding: 20px;
  margin: 0 15px;
  background-color: var(--theme-bg1);
  .content-item {
    margin: 10px 0;
    .content {
      margin: 10px 0;
      overflow: hidden;
      color: #8a919f;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .loading {
    text-align: center;
  }
  .user-nickname:hover {
    color: rgb(var(--primary-6));
  }
}
</style>
