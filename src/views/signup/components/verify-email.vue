<script setup>
import { debounce } from "lodash";
import { ref } from "vue";
import { fetchVerifyEmail, fetchGetCode, fetchVerifyCode } from "@/service";
import { Message } from "@arco-design/web-vue";
const emailVal = ref("");
const codeVal = ref("");
const isVerify = ref(false);
const tipRef = ref("");
const uuIdVal = ref("");
let countdownTimer = ref(null); // 用于保存倒计时的计时器
let countdownSeconds = ref(0); // 倒计时秒数

async function verifyEmailInput() {
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      emailVal.value
    )
  ) {
    tipRef.value.textContent = "邮箱格式错误";
    tipRef.value.style.color = " rgb(var(--danger-6))";
    isVerify.value = false;
    return;
  }
  const res = await fetchVerifyEmail(emailVal.value);
  if (res.code !== 200) {
    tipRef.value.textContent = "邮箱已经被注册";
    tipRef.value.style.color = " rgb(var(--danger-6))";
    isVerify.value = false;
    return;
  }
  if (codeVal.value.trim() === "") {
    tipRef.value.textContent = "验证码不能为空";
    tipRef.value.style.color = " rgb(var(--danger-6))";
    isVerify.value = false;
    return;
  }
  const codeRes = await fetchVerifyCode({ email: emailVal.value, verificationCode: codeVal.value, uuid: uuIdVal.value });
  if (codeRes.code !== 200) {
    tipRef.value.textContent = "验证码错误";
    tipRef.value.style.color = " rgb(var(--danger-6))";
    isVerify.value = false;
    return;
  }
  tipRef.value.textContent = "邮箱和验证码正确";
  tipRef.value.style.color = "rgb(var(--success-6))";
  isVerify.value = true;
}
// 对邮箱验证进行防抖处理
const verifyEmailInput_debounce = debounce(verifyEmailInput, 1000);

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

const handleGetCode = async () => {
  if (!emailVal.value) {
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
    const { data } = await fetchGetCode(emailVal.value);
    console.log(data);
    uuIdVal.value = data.uuid;
    Message.success("验证码已发送，请注意查收");
    startCountdown();
  } catch (error) {
    Message.error("验证码发送失败，请稍后重试");
    startCountdown();
  }
};
defineExpose({
  verifyEmailInput,
  emailVal,
  isVerify,
  codeVal,
  uuIdVal
});
</script>

<template>
  <div class="email">
    <a-input
      @input="verifyEmailInput_debounce"
      v-model="emailVal"
      :style="{ width: '320px' }"
      placeholder="请输入邮箱"
      allow-clear
    >
      <template #prefix>
        <icon-email />
      </template>
    </a-input>
    <a-input
      @input="verifyEmailInput_debounce"
      v-model="codeVal"
      :style="{ width: '220px', marginTop: '20px' }"
      placeholder="请输入验证码"
      allow-clear
    >
      <template #prefix>
        <icon-info-circle />
      </template>
    </a-input>
    <a-button type="primary" :style="{ width: '100px' }" @click="handleGetCode" :disabled="countdownSeconds > 0">
      <span v-if="countdownSeconds > 0"> ({{ countdownSeconds }}s)</span>
      <span v-else>获取验证码</span>
    </a-button>
    <div class="tip" ref="tipRef">请输入正确的邮箱和验证码</div>
  </div>
</template>

<style lang="scss" scoped>
.tip {
  font-size: 10px;
  text-align: center;
  margin-top: 3px;
}
</style>
