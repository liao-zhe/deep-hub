<script setup>
import { ref } from "vue";
import { debounce } from "lodash";

const pwdVal = ref("");
const isVerify = ref(false);
const tipRef = ref("");

function verifyPasswordInput() {
  if (
    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;'"|\\<,>.?/~-])[A-Za-z\d!@#$%^&*()_+={}[\]:;'"|\\<,>.?/~-]{8,16}$/.test(
      pwdVal.value
    )
  ) {
    tipRef.value.textContent = "包含1个大写和小写字母，1个数字，1个特殊字符,长度最少6位";
    tipRef.value.style.color = " rgb(var(--danger-6))";
    isVerify.value = false;
    return;
  }
  tipRef.value.textContent = "密码符合要求";
  tipRef.value.style.color = " rgb(var(--success-6))";
  isVerify.value = true;
}
// 对密码验证进行防抖处理
const verifyPasswordInput_debounce = debounce(verifyPasswordInput, 1000);
defineExpose({
  verifyPasswordInput,
  pwdVal,
  isVerify
});
</script>

<template>
  <div class="password">
    <a-input-password
      @input="verifyPasswordInput_debounce"
      v-model="pwdVal"
      :style="{ width: '320px' }"
      placeholder="请输入密码"
      allow-clear
    />
    <div class="tip" ref="tipRef">包含1个大写和小写字母，1个数字，1个特殊字符,长度最少6位</div>
  </div>
</template>

<style scoped>
.tip {
  font-size: 10px;
  text-align: center;
  margin-top: 3px;
}
</style>
