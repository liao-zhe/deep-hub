<script setup>
import { useRoute, useRouter } from "vue-router";
import { useArticleStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import commentView from "@/components/articleComment/comment-view.vue";
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const articleStore = useArticleStore();
articleStore.getOneArticle(route.params.id);

const { articleDetail } = storeToRefs(articleStore);

const like = ref(false);
// 跳转至用户详情页
const toUserHandler = () => {
  router.push(
    `/user/${props.articleDetail.user.nickname}/?id=${props.articleDetail.userId}&username=${props.articleDetail.user.username}`
  );
};

const onChangeClick = () => {
  like.value = !like.value;
};
</script>

<template>
  <div class="detail">
    <div class="detail-container">
      <div class="detail-main">
        <div class="article-content">
          <a-comment align="right" :author="articleDetail?.user?.nickname" :datetime="articleDetail?.createTime">
            <template #avatar>
              <a-avatar @click="toUserHandler()">
                <img alt="avatar" :src="articleDetail?.user?.avatar ? articleDetail.user.avatar : userStore.defaultAvatar" />
              </a-avatar>
            </template>
            <template #actions>
              <span class="action" key="heart" @click="onChangeClick">
                <span v-if="like"> <IconHeartFill :style="{ color: '#f53f3f' }" /> </span>
                <span v-else>
                  <IconHeart />
                </span>
                {{ articleDetail?.articleLikes + (like ? 1 : 0) }}
              </span>
              <span class="action" key="reply"> <icon-eye /> {{ articleDetail?.viewCount }} </span>
            </template>
            <div style="display: flex; justify-content: flex-end">
              <a-tag v-for="(tag, index) in articleDetail?.labels" :key="index">{{ tag }}</a-tag>
            </div>
            <template #content>
              <div>
                {{ articleDetail?.content }}
                <div>
                  <img
                    v-for="(image, index) in articleDetail?.images"
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
        <comment-view type="article" />
      </div>
      <div class="detail-sidebar">
        <h3>内容推介</h3>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail {
  min-height: calc(100vh - 58px);
  background-color: var(--theme-bg2);
  .detail-container {
    display: flex;
    max-width: 1200px;
    padding: 20px 0;
    margin: 0 auto;
    .detail-main {
      width: 75%;
      .article-content {
        padding: 30px;
        margin-bottom: 10px;
        background-color: var(--color-bg-2);
      }
    }
    .detail-sidebar {
      width: 25%;
      height: 40vh;
      margin-left: 20px;
      background-color: var(--color-bg-2);
    }
  }
  .action {
    display: inline-block;
    line-height: 24px;
    color: var(--color-text-1);
    cursor: pointer;
    background: transparent;
    border-radius: 2px;
    transition: all 0.1s ease;
    &:hover {
      background: var(--color-fill-3);
    }
  }
}
</style>
