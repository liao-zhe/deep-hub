<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, defineEmits, onMounted } from "vue";
import { useUserStore } from "@/stores";
const emits = defineEmits(["createMoment", "removeMoment", "loadMoment"]);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const fileList = ref([]);
const tagList = ref([]);
defineProps({
  moments: {
    type: Array,
    default: () => []
  },
  isShowLoading: {
    type: Boolean,
    default: true
  }
});

const username = userStore.userInfo.username;
const token = userStore.token;
let currentPage = 0;
const pageSize = 10;
// 拿到动态列表
function loadMomentFn(obj) {
  emits("loadMoment", obj);
}

const loadingRef = ref();
onMounted(() => {
  console.log(route.query);
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        currentPage++;
        loadMomentFn({ pagenum: currentPage, pagesize: pageSize, username: route.query.username, observer });
      }
    },
    { threshold: 1 }
  );
  observer.observe(loadingRef.value);
});
// 进入动态详情
const momentDetail = id => {
  router.push(`/detail/${id}`);
};

const momentContent = ref("");
const visible = ref(false);
const formData = new FormData();
let canceled = false;
const handleClick = () => {
  visible.value = true;
};
const handleOk = () => {
  // 清空之前的数据
  formData.delete("content");
  formData.delete("userId");
  formData.delete("labels");
  fileList.value.forEach((file, index) => {
    formData.delete("images");
  });
  // 添加新的数据
  formData.append("content", momentContent.value);
  formData.append("userId", userStore.userInfo.id);
  fileList.value.forEach(file => {
    formData.append("images", file);
  });
  tagList.value.forEach(tag => {
    formData.append("labels", tag);
  });

  // 发送事件并重置数据
  emits("createMoment", formData);
  visible.value = false;
  momentContent.value = "";
  fileList.value = [];
  tagList.value = [];
};

const handleCancel = () => {
  visible.value = false;
  momentContent.value = "";
  tagList.value = [];
  fileList.value = [];
};

const deleteVisible = ref(false);
const curId = ref("");
const removeMoment = id => {
  deleteVisible.value = true;
  curId.value = id;
};
// 删除动态
const deleteHandleOk = () => {
  emits("removeMoment", curId.value);
  deleteVisible.value = false;
};

// 文件上传前回调
let uid = -1;
const beforeUpload = file => {
  if (canceled) {
    return false; // 如果取消了发布，则不执行上传操作
  }
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  const isLt3M = file.size / 1024 / 1024 < 3;
  if (!isJpgOrPng) {
    Message.error("只能上传 JPG/PNG 格式的文件！");
    return false;
  }
  if (!isLt3M) {
    Message.error("图片大小不能超过 3MB！");
    return false;
  }
  const fileUrl = URL.createObjectURL(file);
  file.url = fileUrl;
  file.uid = uid--;
  fileList.value.push(file);
  return false;
};
</script>

<template>
  <div class="user-content">
    <a-tabs position="left">
      <a-tab-pane key="1" title="动态">
        <div class="add-moment-section" v-if="$route.query.username === username && token">
          <!-- 发布动态对话框 -->
          <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" ok-text="发布">
            <template #title> 动态内容 </template>
            <a-textarea
              v-model="momentContent"
              placeholder="这一刻的想法……"
              :max-length="255"
              allow-clear
              show-word-limit
              :auto-size="{
                minRows: 4,
                maxRows: 8
              }"
            />
            <!-- 标签 -->
            <a-input-tag
              v-model="tagList"
              :style="{ width: '100%', marginBottom: '10px' }"
              placeholder="请输入标签"
              allow-clear
            />
            <!-- 文件上传 -->
            <a-upload
              v-model:file-list="fileList"
              list-type="picture-card"
              :auto-upload="false"
              :limit="9"
              image-preview
              @before-upload="beforeUpload"
            />
          </a-modal>
          <a-button type="primary" @click="handleClick">发布动态+</a-button>
        </div>
        <a-comment
          v-for="item in moments"
          :author="item.user.nickname"
          :datetime="item.createAt"
          :key="item.id"
          class="content-item"
          align="right"
        >
          <template #actions>
            <span class="action" key="heart" @click="onLikeChange">
              <IconHeart />
              {{ item.likes }}
            </span>
            <span class="action" key="reply"> <IconMessage /> {{ item.commentCount }} </span>
            <span class="delete" @click="removeMoment(item.id)" v-if="$route.query.username === username && token">
              <icon-delete /> 删除
            </span>
          </template>
          <template #content>
            <div @click="momentDetail(item.id)" class="moment-content">
              {{ item.content }}
            </div>
          </template>
        </a-comment>
        <!-- 删除对话框 -->
        <a-modal v-model:visible="deleteVisible" @ok="deleteHandleOk" :simple="true">
          <div>
            <icon-exclamation-circle-fill style="color: rgb(var(--warning-6))" />
            你确定要删除此动态吗？删除后不可恢复！
          </div>
        </a-modal>
        <div class="loading" ref="loadingRef" v-if="isShowLoading">
          <a-spin dot />
        </div>
        <h3 v-else style="color: var(--color-text-3); text-align: center">
          <icon-info-circle />
          已经加载到底部了
        </h3>
      </a-tab-pane>
      <a-tab-pane key="2" title="文章"> Content of Tab Panel 2 </a-tab-pane>
      <a-tab-pane key="3" title="收藏"> Content of Tab Panel 3 </a-tab-pane>
      <a-tab-pane key="4" title="关注"> Content of Tab Panel 4 </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss" scoped>
.user-content {
  background-color: var(--color-bg-1);
  margin: 20px 0;
  padding: 20px;
  .moment-content {
    cursor: pointer;
  }
}
.add-moment-section {
  text-align: right;
}
.delete {
  cursor: pointer;
  &:hover {
    color: rgb(var(--warning-6));
  }
}
.loading {
  text-align: center;
}
</style>
