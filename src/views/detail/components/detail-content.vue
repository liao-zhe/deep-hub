<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
const userStore = useUserStore();
const router = useRouter();
const props = defineProps({
  momentDetail: {
    type: Object,
    default: () => ({})
  }
});

const like = ref(false);
// 跳转至用户详情页
const toUserHandler = () => {
  router.push(
    `/user/${props.momentDetail.user.nickname}/?id=${props.momentDetail.userId}&username=${props.momentDetail.user.username}`
  );
};

const onChangeClick = () => {
  like.value = !like.value;
};
</script>

<template>
  <div class="moment-content">
    <a-comment align="right" :author="momentDetail.user.nickname" :datetime="momentDetail.createTime">
      <template #avatar>
        <a-avatar @click="toUserHandler()">
          <img alt="avatar" :src="momentDetail.user.avatar ? momentDetail.user.avatar : userStore.defaultAvatar" />
        </a-avatar>
      </template>
      <template #actions>
        <span class="action" key="heart" @click="onChangeClick">
          <span v-if="like"> <IconHeartFill :style="{ color: '#f53f3f' }" /> </span>
          <span v-else>
            <IconHeart />
          </span>
          {{ momentDetail.momentLikes + (like ? 1 : 0) }}
        </span>
        <span class="action" key="reply"> <icon-eye /> {{ momentDetail.viewCount }} </span>
      </template>
      <div style="display: flex; justify-content: flex-end">
        <a-tag v-for="(tag, index) in momentDetail.labels" :key="index">{{ tag }}</a-tag>
      </div>
      <template #content>
        <div>
          {{ momentDetail.content }}
          <div>
            <img
              v-for="(image, index) in momentDetail.images"
              :key="index"
              :src="image"
              alt=""
              style="height: 200px; margin-right: 10px"
            />
          </div>
        </div>
      </template>
    </a-comment>
  </div>
</template>

<style lang="scss" scoped>
.moment-content {
  padding: 30px;
  margin-bottom: 10px;
  background-color: var(--color-bg-2);
}
</style>
