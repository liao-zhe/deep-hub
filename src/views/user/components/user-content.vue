<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, defineEmits, onMounted, watch } from "vue";
import { useUserStore, useArticleStore } from "@/stores";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const emits = defineEmits(["createMoment", "removeMoment", "loadMoment", "loadArticle"]);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const articleStore = useArticleStore();
const fileList = ref([]);
const tagList = ref([]);
defineProps({
  moments: {
    type: Array,
    default: () => []
  },
  articles: {
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
// let currentPage = 1;
// const pageSize = 15;
// // 拿到动态列表
// function loadMomentFn(obj) {
//   emits("loadMoment", obj);
// }
// function loadArticleFn(obj) {
//   emits("loadArticle", obj);
// }
// const loadingRef = ref();
// const observeScrollLoading = loadFn => {
//   const observer = new IntersectionObserver(
//     entries => {
//       if (entries[0].isIntersecting) {
//         currentPage++;
//         loadFn({ pagenum: currentPage, pagesize: pageSize, username: route.query.username, observer });
//       }
//     },
//     { threshold: 1 }
//   );
//   observer.observe(loadingRef.value);
// };
// onMounted(() => {
//   // 滚动加载动态内容
//   observeScrollLoading(loadMomentFn);
//   // 滚动加载文章内容
//   observeScrollLoading(loadArticleFn);
// });
// 进入动态详情
const momentDetail = id => {
  router.push(`/detail/${id}`);
};

const momentContent = ref("");
const visible = ref(false);
const formData = new FormData();
let canceled = false;

const handleClick = async state => {
  if (state === "动态") {
    visible.value = true;
  } else {
    drawervisible.value = true;
  }
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

const labelsList = ref([]);
const formModel = ref({
  title: "",
  content: "",
  cover: "", //file对象
  labels: labelsList.value
});

const formRef = ref();
const drawervisible = ref(false);

const handlerClose = () => {
  formRef.value.clearValidate();
  drawer.value = false;
};
// 文章回调
const handleArticleOk = () => {
  console.log(formModel.value);
  const formData = new FormData();
  for (const key in formModel.value) {
    formData.append(key, formModel.value[key]);
  }
  articleStore.createArticle(formData).then(res => {
    if (res) {
      Message.success("发布成功！");
      formModel.value = {
        title: "",
        content: "",
        cover: "",
        labels: ""
      };
    } else {
      Message.error("发布失败！");
    }
  });
  drawervisible.value = false;
};
const handleArticleCancel = () => {
  drawervisible.value = false;
  formModel.value = {
    title: "",
    content: "",
    cover: "",
    labels: ""
  };
};

const onChange = (_, currentFile) => {
  formModel.value.cover = {
    file: currentFile.file,
    url: URL.createObjectURL(currentFile.file)
  };
};
const onProgress = currentFile => {
  formModel.value.cover = currentFile.file;
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
          <a-button type="primary" @click="handleClick('动态')">发布动态+</a-button>
        </div>
        <a-comment
          v-for="item in moments"
          :author="item.user.nickname"
          :datetime="item.createTime"
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
        <!-- <div class="loading" v-if="isShowLoading">
          <a-spin dot />
        </div>
        <h3 v-else style="color: var(--color-text-3); text-align: center">
          <icon-info-circle />
          已经加载到底部了
        </h3> -->
      </a-tab-pane>
      <a-tab-pane key="2" title="文章">
        <a-drawer
          :before-close="handlerClose"
          class="add-article-sction"
          width="50%"
          size="50"
          :visible="drawervisible"
          @ok="handleArticleOk"
          @cancel="handleArticleCancel"
          unmount-on-close
        >
          <template #title> 发布文章 </template>
          <a-form v-if="$route.query.username === username && token" :model="formModel" @submit="handleSubmit" ref="formRef">
            <a-form-item field="size" label="文章标题">
              <a-input
                :style="{ width: '100%', marginBottom: '10px' }"
                placeholder="请输入文章标题"
                allow-clear
                v-model="formModel.title"
              />
            </a-form-item>
            <a-form-item field="size" label="文章封面">
              <!-- 文章封面 -->
              <a-upload
                :auto-upload="false"
                :file-list="formModel.cover ? [formModel.cover] : []"
                :show-file-list="false"
                @change="onChange"
                @progress="onProgress"
              >
                <template #upload-button>
                  <div
                    :class="`arco-upload-list-item${formModel.cover && formModel.cover.status === 'error' ? ' arco-upload-list-item-error' : ''}`"
                  >
                    <div class="arco-upload-list-picture custom-upload-avatar" v-if="formModel.cover && formModel.cover.url">
                      <img :src="formModel.cover.url" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                      <a-progress
                        v-if="formModel.cover.status === 'uploading' && formModel.cover.percent < 100"
                        :percent="formModel.cover.percent"
                        type="circle"
                        size="mini"
                        :style="{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translateX(-50%) translateY(-50%)'
                        }"
                      />
                    </div>
                    <div class="arco-upload-picture-card" v-else>
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600"></div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
            </a-form-item>
            <a-form-item field="size" label="文章标签">
              <a-input-tag v-model="formModel.labels" :style="{ width: '100%' }" placeholder="请输入标签" allow-clear />
            </a-form-item>
            <a-form-item field="size" label="文章内容">
              <div class="editor">
                <quill-editor
                  placeholder="请输入文章内容"
                  theme="snow"
                  v-model:content="formModel.content"
                  content-type="html"
                  @blur="validateQuillContent"
                >
                </quill-editor>
              </div>
            </a-form-item>
          </a-form>
        </a-drawer>
        <!-- 发布文章对话框 -->
        <!-- <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" ok-text="发布"> </a-modal> -->
        <a-button type="primary" @click="handleClick('文章')">发布文章+</a-button>
        <a-comment
          v-for="item in articles"
          :author="item.user.nickname"
          :datetime="item.createTime"
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
        <!-- <div class="loading" v-if="true">
          <a-spin dot />
        </div>
        <h3 v-else style="color: var(--color-text-3); text-align: center">
          <icon-info-circle />
          已经加载到底部了
        </h3> -->
      </a-tab-pane>
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
.editor {
  width: 100%;
  height: 300px;
}
</style>
