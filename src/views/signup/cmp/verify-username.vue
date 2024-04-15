<script setup>
import { ref } from "vue";
import { debounce } from "lodash";
import { fetchVerifyUsername } from "@/service";
const usernameVal = ref("");
const isVerify = ref(false);
const tipRef = ref("");

async function verifyUsernameInput() {
  if (!/^[a-zA-Z0-9\u0391-\uFFE5]{4,8}$/.test(usernameVal.value)) {
    tipRef.value.textContent = "任意字母（大小写）、数字以及汉字（包括全角字符）的字符串，4-8位";
    tipRef.value.style.color = " rgb(var(--danger-6))";
    isVerify.value = false;
    return;
  }
  const res = await fetchVerifyUsername(usernameVal.value);
  console.log(res);
  if (res.code !== 200) {
    tipRef.value.textContent = "用户名已经被注册";
    tipRef.value.style.color = " rgb(var(--danger-6))";
    isVerify.value = false;
    return;
  }
  tipRef.value.textContent = "用户名符合要求";
  tipRef.value.style.color = "rgb(var(--success-6))";
  isVerify.value = true;
}
// 对用户名验证进行防抖处理
const verifyUsernameInput_debounce = debounce(verifyUsernameInput, 500);
defineExpose({
  verifyUsernameInput,
  usernameVal,
  isVerify
});
</script>

<template>
  <div class="username">
    <a-input
      @input="verifyUsernameInput_debounce"
      v-model="usernameVal"
      :style="{ width: '320px' }"
      placeholder="请输入用户名"
      allow-clear
    >
      <template #prefix>
        <icon-user />
      </template>
    </a-input>
    <div class="tip" ref="tipRef">任意字母（大小写）、数字以及汉字（包括全角字符）的字符串，4-8位</div>
  </div>
</template>

<style scoped>
.tip {
  font-size: 10px;
  text-align: center;
  margin-top: 3px;
}
</style>
