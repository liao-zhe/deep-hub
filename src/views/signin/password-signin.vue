<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { usernameRule, passwordRule } from "./formRules";
import { fetchLogin } from "@/service/modules/userService";
import { useUserStore } from "@/stores";

const router = useRouter();
const userStore = useUserStore();

const signinLoading = ref(false);
const loginFormRef = ref();
const loginForm = reactive({
  username: "",
  password: ""
});

const handleSubmit = async () => {
  signinLoading.value = true;
  try {
    // 1.执行登录接口
    const { data } = await fetchLogin(loginForm);
    userStore.setToken(data.token);
    userStore.setUserInfo(data.userInfo);
    // 2.跳转到首页
    router.push("/home");
    Message.success("登录成功");
  } catch (error) {
    signinLoading.value = false;
  }
};
const toSignup = () => {
  // 跳转至注册页
  console.log("跳转至注册页面");
  router.push("/signup");
};
// 记住密码处理
// const keepPwd = ref(JSON.parse(localStorage.getItem('keepPwd')))
// watch(keepPwd, (newVal) => {
//   console.log(newVal)
//   localStorage.setItem('keepPwd', newVal)
// })
// v-model="keepPwd"
</script>

<template>
  <div class="form-container">
    <a-form :model="loginForm" layout="vertical" class="login-form" @submit-success="handleSubmit" ref="loginFormRef">
      <!-- 邮箱输入框 -->
      <a-form-item field="username" label="账号" :rules="usernameRule">
        <a-input v-model="loginForm.username" placeholder="请输入账号" allow-clear>
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <!-- 密码输入框 -->
      <a-form-item field="password" label="密码" :rules="passwordRule">
        <a-input-password v-model="loginForm.password" placeholder="请输入密码" allow-clear autocomplete>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" long html-type="submit" :loading="signinLoading">登录</a-button>
      </a-form-item>
      <a-form-item field="isRemember" class="handler">
        <a-checkbox> 记住密码 </a-checkbox>
        <div class="forgetPassword">忘记密码</div>
      </a-form-item>
    </a-form>
    <div class="to-signup">
      没有账号？
      <span @click="toSignup">立即注册</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
:deep(.arco-form-item-content.arco-form-item-content-flex) {
  justify-content: space-between;
  .forgetPassword {
    color: rgb(var(--primary-6));
    cursor: pointer;
  }
}

.form-container {
  flex: 1;
  .to-signup {
    text-align: center;
    span {
      cursor: pointer;
      color: rgb(var(--primary-6));
    }
  }
}
</style>
