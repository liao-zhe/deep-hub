<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore, useMomentStore, useQuestionStore } from "@/stores";
import { storeToRefs } from "pinia";
import { Message } from "@arco-design/web-vue";
const userStore = useUserStore();
const momentStore = useMomentStore();
const questionStore = useQuestionStore();
const { verifyLogin } = storeToRefs(userStore);
const router = useRouter();
const route = useRoute();
// 检查是否登录
if (userStore.token) {
  verifyLogin.value = true;
}

const nickname = () => {
  return userStore.userInfo.nickname;
};
const visible = ref(false);
// 注销登录
const signoutClick = () => {
  visible.value = true;
};
// 确定退出
const handleOk = () => {
  userStore.setToken("");
  userStore.setUserInfo("");
  router.replace("/home");
  verifyLogin.value = false;
};

const defaultKey = ref(["1"]);

// 进入登录界面
const signinClick = () => {
  router.push("/signin");
};
// 进入注册界面
const signupClick = () => {
  router.push("/signup");
};
// 进入home主页
const toHome = () => {
  router.push("/home");
  defaultKey.value = ["1"];
};

// 进入动态界面
const toMoment = () => {
  router.push("/moment");
  defaultKey.value = ["2"];
};

const toQuestionAnswer = () => {
  router.push("/questionAnswer");
  defaultKey.value = ["3"];
};

const searchArticle = value => {
  if (value) {
    router.push(`/home?search=${value}`);
  } else {
    router.push("/home");
  }
  setTimeout(() => {
    location.reload();
  }, 0);
};

const content = ref();
const modalVisible = ref(false);
const createQuestion = () => {
  modalVisible.value = true;
};
const handleModalOk = async () => {
  await questionStore
    .createQuestion({ content: content.value, userId: userStore.userInfo.id })
    .then(res => {
      Message.success("创建成功");
      router.push(`/questionDetail/${questionStore.newQuestionInfo.id}`);
      content.value = "";
      modalVisible.value = false;
    })
    .catch(error => {
      Message.error("创建失败");
      content.value = "";
      modalVisible.value = false;
      console.log(error);
    });
};
const handleModalCancel = () => {
  content.value = "";
  modalVisible.value = false;
};
</script>

<template>
  <div class="navbar">
    <a-modal v-model:visible="visible" @ok="handleOk" :simple="true">
      <div><icon-exclamation-circle-fill style="color: rgb(var(--warning-6))" /> 你确定要退出登录吗？</div>
    </a-modal>
    <a-row align="center">
      <a-col :flex="2" class="left">
        <div
          :style="{
            width: '80px',
            height: '30px',
            borderRadius: '2px',
            background: 'var(--color-fill-3)',
            cursor: 'pointer'
          }"
        />
      </a-col>
      <a-col :flex="8" class="center">
        <a-menu mode="horizontal" :default-selected-keys="defaultKey">
          <a-menu-item key="1" @click="toHome">首页</a-menu-item>
          <a-menu-item key="2" @click="toMoment">动态</a-menu-item>
          <a-menu-item key="3" @click="toQuestionAnswer">问答</a-menu-item>
        </a-menu>
        <a-input-search
          :style="{ width: '320px', marginRight: '110px' }"
          placeholder="请输入搜索内容"
          search-button
          @search="searchArticle"
        />
      </a-col>
      <a-button type="primary" shape="round" @click="createQuestion">提问</a-button>
      <a-modal v-model:visible="modalVisible" @ok="handleModalOk" @cancel="handleModalCancel">
        <template #title> 提问 </template>
        <a-textarea
          v-model="content"
          placeholder="写下你的问题，准确地描述问题更容易得到解答"
          :auto-size="{
            minRows: 2,
            maxRows: 5
          }"
          style="margin-top: 20px"
        />
      </a-modal>
      <a-col :flex="2" class="right">
        <icon-notification class="notify" />
        <a-popover v-if="verifyLogin">
          <a-avatar :size="36" class="avatar">
            <img :src="userStore.userInfo.avatar ? userStore.userInfo.avatar : userStore.defaultAvatar" alt="" />
          </a-avatar>
          <template #content>
            <router-link
              :to="`/user/${nickname()}/?id=${userStore.userInfo.id}&username=${userStore.userInfo.username}`"
              target="_blank"
            >
              <p class="central">个人中心</p>
            </router-link>
            <p @click="resetPassword" class="signup">修改密码</p>
            <p @click="signoutClick" class="signout">退出登录</p>
          </template>
        </a-popover>
        <a-popover v-else>
          <a-avatar class="avatar" :size="36">未登录</a-avatar>
          <template #content>
            <p @click="signinClick" class="signin">立即登录</p>
            <p @click="signupClick" class="signup">立即注册</p>
          </template>
        </a-popover>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.central,
.signout,
.signin,
.signup {
  color: var(--color-text-1);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.navbar {
  background-color: var(--color-menu-light-bg);
  box-shadow: 0 0 10px -5px #86909c;
  .left,
  .right {
    display: flex;
    justify-content: center;
  }
  .center {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
    .notify {
      margin-right: 15px;
      font-size: 20px;
      cursor: pointer;
    }
    .avatar {
      cursor: pointer;
    }
  }
}
.arco-textarea-wrapper {
  background-color: white;
  border: none;
}
</style>
