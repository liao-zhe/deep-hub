<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import questionContent from "./components/question-content.vue";
import answerContent from "./components/answer-content.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useQuestionStore } from "@/stores";
import { storeToRefs } from "pinia";
import "@arco-design/web-vue/es/message/style/css.js";
import { Message } from "@arco-design/web-vue";

const route = useRoute();
const questionStore = useQuestionStore();
questionStore.getOneQuestion(route.params.id);
const { currentQuestion, answerList } = storeToRefs(questionStore);
const content = ref();

const isShowLoading = ref(true);
const loadAnswerHandler = async payload => {
  const res = await questionStore.getAnswerList(currentQuestion.id, {
    pagenum: questionStore.pagenum++,
    pagesize: 15
  });
  // 当res为false表示所有数据都查询出来了，此时要关闭观察器，并隐藏loading
  if (res === false) {
    // 当没有更多数据可加载时，停止下拉加载
    payload.observer.disconnect();
    isShowLoading.value = false;
  }
};

// 回答问题
const sendAnswer = () => {
  const textOnlyContent = content.value.replace(/<[^>]+>/g, "");
  questionStore
    .createAnswer(currentQuestion.value.id, {
      content: textOnlyContent,
      questionId: currentQuestion.value.id,
      userId: currentQuestion.value.userId
    })
    .then(response => {
      Message.success("回答成功");
    })
    .catch(error => {
      Message.error("回答失败");
      console.error("Error creating answer:", error);
    });
  questionStore.isEdit = false;
};

// 删除回答
const deleteAnswer = id => {
  questionStore
    .removeAnswer(id)
    .then(response => {
      Message.success("删除回答成功");
    })
    .catch(error => {
      Message.error("删除回答失败");
      console.error("Error creating answer:", error);
    });
};

// 删除问题
const deleteQuestion = id => {
  questionStore
    .removeQuestion(id)
    .then(response => {
      Message.success("删除问题成功");
    })
    .catch(error => {
      Message.error("删除问题失败");
      console.error("Error creating answer:", error);
    });
};
</script>
<template>
  <div class="detail">
    <div class="detail-container">
      <div class="detail-main">
        <question-content v-if="currentQuestion" :question-detail="currentQuestion"></question-content>
        <quill-editor v-if="questionStore.isEdit" theme="snow" v-model:content="content" content-type="html"> </quill-editor>
        <a-button type="primary" size="small" @click="sendAnswer" v-show="questionStore.isEdit">
          <template #default>发送回答</template>
        </a-button>
      </div>
      <answer-content
        v-if="answerList"
        :answer-list="answerList"
        @load-answer="loadAnswerHandler"
        :is-show-loading="isShowLoading"
      ></answer-content>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.detail {
  background-color: var(--theme-bg2);
  min-height: calc(100vh - 58px);
  .detail-container {
    max-width: 1200px;
    padding: 20px 0;
    margin: 0 auto;
    display: flex;
    .detail-main {
      width: 75%;
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
</style>
