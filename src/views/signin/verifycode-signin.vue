<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { emailRule, codeRule } from "./formRules";
import { fetchCodeLogin, fetchGetCode } from "@/service";
import { useUserStore } from "@/stores";

const router = useRouter();
const userStore = useUserStore();

let countdownTimer = ref(null); // 用于保存倒计时的计时器
let countdownSeconds = ref(0); // 倒计时秒数
const signinLoading = ref(false);
const loginFormRef = ref();
const loginForm = reactive({
  email: "",
  verificationCode: "",
  uuid: ""
});

const handleSubmit = async () => {
  signinLoading.value = true;
  try {
    // 1.执行登录接口
    const { data } = await fetchCodeLogin(loginForm);
    userStore.setToken(data.token);
    userStore.setUserInfo(data.userInfo);
    // 2.跳转到首页
    router.push("/home");
    Message.success("登录成功");
  } catch (error) {
    signinLoading.value = false;
  }
};

const handleGetCode = async () => {
  if (!loginForm.email) {
    // 如果邮箱为空，不发送验证码
    Message.error("请输入邮箱");
    return;
  }
  if (countdownSeconds.value > 0) {
    // 如果还在倒计时，直接返回
    return;
  }
  try {
    // 获取验证码
    const { data } = await fetchGetCode(loginForm.email);
    loginForm.uuid = data.uuid;
    console.log(loginForm.uuid);
    Message.success("验证码已发送，请注意查收");
    startCountdown();
  } catch (error) {
    Message.error("验证码发送失败，请稍后重试");
    startCountdown();
  }
};

// 倒计时
const startCountdown = () => {
  countdownSeconds.value = 60;
  countdownTimer.value = setInterval(() => {
    countdownSeconds.value--;
    if (countdownSeconds.value <= 0) {
      clearInterval(countdownTimer.value);
    }
  }, 1000);
};
</script>

<template>
  <div class="form-container">
    <a-form :model="loginForm" layout="vertical" class="login-form" @submit-success="handleSubmit" ref="loginFormRef">
      <!-- 邮箱输入框 -->
      <a-form-item field="email" label="邮箱" :rules="emailRule">
        <a-input v-model="loginForm.email" placeholder="请输入邮箱" allow-clear>
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <!-- 密码输入框 -->
      <a-form-item field="verificationCode" label="验证" :rules="codeRule">
        <a-input v-model="loginForm.verificationCode" placeholder="请输入验证码" allow-clear autocomplete>
          <template #prefix>
            <icon-info-circle />
          </template>
        </a-input>
        <a-button type="primary" @click="handleGetCode" :disabled="countdownSeconds > 0">
          获取验证码<span v-if="countdownSeconds > 0"> ({{ countdownSeconds }}s)</span>
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" long html-type="submit" :loading="signinLoading">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="scss" scoped></style>
