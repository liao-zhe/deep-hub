<script setup lang="ts">
import verifycodeSignin from "./verifycode-signin.vue";
import passwordSignin from "./password-signin.vue";
import { reactive, ref } from "vue";

const curTabActive = ref(0);
const tabs = reactive(["密码登录", "验证码登录"]);
const tabClick = index => {
  curTabActive.value = index;
};
</script>

<template>
  <div class="signin-view">
    <div class="signin-section">
      <div class="left-section">
        <div class="login-mode">
          <span v-for="(item, index) in tabs" :key="index" @click="tabClick(index)" :class="{ active: curTabActive === index }">
            {{ item }}
          </span>
        </div>
        <password-signin v-if="curTabActive === 0" />
        <verifycode-signin v-if="curTabActive === 1" />
      </div>
      <div class="right-section">
        <div class="circle"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.signin-view {
  background-color: var(--theme-bgk1);
  display: flex;
  justify-content: center;
  margin-top: 18vh;
}
.signin-section {
  background-color: #fff;
  width: 700px;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px -5px #86909c;
  height: fit-content;
  .left-section,
  .right-section {
    flex: 1;
  }
  .left-section {
    padding: 30px 30px;
    .login-mode {
      font-size: 14px;
      color: #c9cdd4;
      margin-bottom: 10px;
      text-align: right;
      span {
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .right-section {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7f9;
    .circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: rgb(var(--primary-6));
      position: relative;
      &::after {
        content: "";
        width: 180px;
        height: 85px;
        background-color: transparent;
        backdrop-filter: blur(8px);
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translateX(50%);
      }
    }
  }
}
.active {
  font-size: 14px;
  color: rgb(var(--primary-6));
  border-bottom: 2px solid rgb(var(--primary-6));
}
</style>
