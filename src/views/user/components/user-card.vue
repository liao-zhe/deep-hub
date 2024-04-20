<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores";
const userStore = useUserStore();
import dayjs from "dayjs";
const router = useRouter();
const route = useRoute();
const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({})
  },
  userInfo: {
    type: Object,
    default: () => ({})
  },
  token: {
    type: String,
    default: () => ""
  }
});
const gender = computed(() => {
  if (props.currentUser.gender === 0) {
    return "女";
  } else if (props.currentUser.gender === 1) {
    return "男";
  } else {
    return "未知";
  }
});
const data = ref([
  {
    label: "性别",
    value: gender
  },
  {
    label: "用户等级",
    value: "LV" + props.currentUser.level
  },
  {
    label: "加入时间",
    value: dayjs(props.currentUser.createTime).format("YYYY-MM-DD")
  }
]);

const username = props.userInfo.username;
const token = props.token;
const toEdit = () => {
  router.push(`/user/edit`);
};
</script>

<template>
  <div class="user-card">
    <a-avatar class="avatar" :size="100">
      <img :src="currentUser.avatar ? currentUser.avatar : userStore.defaultAvatar" alt="" />
    </a-avatar>
    <div class="user-info">
      <a-descriptions :data="data" :title="currentUser.nickname" :column="{ xs: 1, md: 3, lg: 4 }">
        <a-descriptions-item v-for="(item, index) of data" :label="item.label" :key="index">
          <a-tag>{{ item.value }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :column="{ xs: 1, md: 3, lg: 4 }">
        <a-descriptions-item label="个人简介">
          <p>{{ currentUser.bio ? currentUser.bio : "暂无" }}</p>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="edit-user">
      <a-button type="outline" v-if="$route.query.username === username && token" @click="toEdit"> 编辑资料 </a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-card {
  display: flex;
  background-color: var(--color-bg-1);
  padding: 30px;
  .avatar {
    margin-right: 40px;
  }
  .edit-user {
    flex: 1;
    text-align: right;
  }
}
</style>
