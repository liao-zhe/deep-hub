<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { IconHeart, IconMessage, IconHeartFill } from "@arco-design/web-vue/es/icon";
const likes = ref({});
const onLikeChange = id => {
  if (!likes.value[id]) return (likes.value[id] = true);
  likes.value[id] = !likes.value[id];
};
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
    <div style="margin: 10px 0" v-for="item in articles" :datetime="item.createAt" :key="item.id" class="content-item">
      <div style="display: flex; justify-content: space-between">
        <div>
          <div style="font-size: 22px; font-weight: 800">{{ item.title }}</div>
          <div class="content">
            {{ item.content }}
          </div>

          <div style="font-size: 12px; color: #8a919f">
            <span>{{ item.user.nickname }}</span>
            <span style="padding: 0 5px; color: #e1e1e1">|</span>
            <span><icon-eye /> {{ item.viewCount }} </span>
          </div>
        </div>
        <div style="text-align: right">
          <div v-if="item.cover">
            <img style="height: 100px" :src="item.cover" alt="" />
          </div>
          <div v-else style="height: 100px"></div>
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
    cursor: pointer;
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
}
.action {
  display: inline-block;
  padding: 0 4px;
  line-height: 24px;
  color: var(--color-text-1);
  cursor: pointer;
  background: transparent;
  border-radius: 2px;
  transition: all 0.1s ease;
  &:hover {
    background: var(--color-fill-3);
  }
  .article-content:hover a {
    color: rgb(var(--primary-6));
  }
}
</style>
