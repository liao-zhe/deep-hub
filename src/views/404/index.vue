<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="not-found">
    <h2 class="animated">404</h2>
    <p class="animated">Oops! 页面找不到了...</p>
    <button class="animated" @click="goHome">返回首页</button>
  </div>
</template>

<style lang="less" scoped>
.animated {
  animation: bounceIn 1s ease both;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url("your-background-image.jpg");
  background-size: cover;
  color: #fff; /* 文字颜色 */
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff; /* 按钮背景色 */
  color: #fff; /* 按钮文字颜色 */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3; /* 鼠标悬停时的按钮背景色 */
}
</style>
