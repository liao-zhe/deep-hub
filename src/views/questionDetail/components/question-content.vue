<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore, useQuestionStore } from "@/stores";
const userStore = useUserStore();
const questionStore = useQuestionStore();
const router = useRouter();
defineProps({
  questionDetail: {
    type: Object,
    default: () => ({})
  }
});

// 跳转至用户详情页
// const toUserHandler = () => {
//   router.push();
// };
const buttonType = computed(() => {
  return questionStore.isEdit ? "outline" : "primary";
});
</script>

<template>
  <div class="moment-content">
    <a-comment align="right" :author="questionDetail.user.nickname" :datetime="questionDetail.createTime">
      <!-- <template #actions>
        <span class="action" key="reply"> <icon-eye /> {{ questionDetail.viewCount }} </span>
      </template> -->
      <template #content>
        <h2>
          {{ questionDetail.content }}
        </h2>
        <a-button :type="buttonType" size="small" @click="questionStore.isEdit = true">
          <template #icon>
            <icon-edit />
          </template>
          <template #default>写回答</template>
        </a-button>
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
