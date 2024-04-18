<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { IconHeart, IconMessage, IconHeartFill } from "@arco-design/web-vue/es/icon";

const likes = ref({});
const onLikeChange = id => {
  if (!likes.value[id]) return (likes.value[id] = true);
  likes.value[id] = !likes.value[id];
};
defineProps({
  moments: {
    type: Object,
    default: () => ({})
  },
  isShowLoading: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(["loadMoment"]);
function loadMomentFn(obj) {
  emits("loadMoment", obj);
}

const loadingRef = ref();
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        loadMomentFn({ pagesize: 15, observer });
      }
    },
    { threshold: 1 }
  );
  observer.observe(loadingRef.value);
});
</script>

<template>
  <div class="content">
    <a-comment v-for="item in moments" :datetime="item.createAt" :key="item.id" class="content-item" align="right">
      <template #author>
        <div class="author-info">
          <router-link :to="`/user/${item.user.username}`" target="_blank">
            {{ item.user.username }}
          </router-link>
        </div>
        <img class="content-img" v-if="item.images && item.images.length > 0" :src="item.images[0]" alt="" />
      </template>
      <template #actions>
        <span class="action" key="heart" @click="onLikeChange(item.id)">
          <span v-if="likes[item.id]">
            <IconHeartFill :style="{ color: '#f53f3f' }" />
          </span>
          <span v-else>
            <IconHeart />
          </span>
          {{ item.likes }}
        </span>
        <span class="action" key="reply"> <IconMessage /> {{ item.commentCount }} </span>
      </template>
      <template #avatar>
        <router-link :to="`/user/${item.user.username}`" target="_blank">
          <div class="avatar-info">
            <a-avatar>
              <img alt="avatar" :src="item.user.avatar" />
            </a-avatar>
          </div>
        </router-link>
      </template>
      <template #content>
        <div class="moment-content">
          <router-link :to="`/detail/${item.id}`" target="_blank">
            {{ item.content }}
          </router-link>
        </div>
      </template>
    </a-comment>
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
  background-color: var(--theme-bg1);
  margin: 0 15px;
  padding: 20px;
  .content-item {
    display: flex;
    cursor: pointer;
    align-items: center;
    .content-img {
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }
  }
}
.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.action:hover {
  background: var(--color-fill-3);
}

.moment-content:hover a {
  color: rgb(var(--primary-6));
}

.loading {
  text-align: center;
}
</style>
