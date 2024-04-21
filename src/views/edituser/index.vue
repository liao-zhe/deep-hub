<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { IconEdit } from "@arco-design/web-vue/es/icon";
import { Modal } from "@arco-design/web-vue";
import { Message } from "@arco-design/web-vue";
// 子组件
// arcoDesign
// store
import { useUserStore } from "@/stores";
const router = useRouter();
const userStore = useUserStore();
const { userInfo } = userStore;
const formData = new FormData();
const user = userInfo;
const formDataAppend = () => {
  formData.append("nickname", user.nickname);
  formData.append("bio", user.bio);
  formData.append("gender", user.gender);
  formData.append("phone", user.phone);
  formData.append("email", user.email);
  formData.append("birthday", user.birthday);
  formData.append("school", user.school);
  formData.append("major", user.major);
  formData.append("position", user.position);
  formData.append("github", user.github);
  formData.append("id", user.id);
};

const deleteFormData = () => {
  formData.delete("avatar");
  formData.delete("nickname");
  formData.delete("bio");
  formData.delete("gender");
  formData.delete("phone");
  formData.delete("email");
  formData.delete("birthday");
  formData.delete("school");
  formData.delete("major");
  formData.delete("position");
  formData.delete("github");
  formData.delete("id");
};
const handleSubmit = async () => {
  formDataAppend();
  await userStore.updateUser(user.id, formData);
  await userStore.getUserInfo(userInfo.id);
  Message.success("个人信息修改成功");
  router.push(`/user/${userInfo.nickname}/?id=${userInfo.id}&username=${userInfo.username}`);
  deleteFormData();
  // setTimeout(() => {
  //   router.go(0);
  // }, 0);
};

const onChangeBirthday = value => {
  userInfo.birthday = new Date(value);
};

const file = ref({});

// 上传的文件状态发生改变时触发
const onChange = (_, currentFile) => {
  file.value = {
    ...currentFile
  };
};

// 头像上传前的校验
const beforeUpload = file => {
  return new Promise((resolve, reject) => {
    if ((file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") && file.size <= 1 * 1024 * 1024) {
      return resolve(true);
    }
    Modal.warning({
      title: "警告",
      content: `“ ${file.name} ” 图片不符合要求，请重新选择`,
      onOk: () => reject("cancel")
    });
  });
};
// 自行上传
const customRequest = option => {
  const { fileItem } = option;
  formData.append("avatar", fileItem.file);
};
</script>

<template>
  <div class="edit-user">
    <div class="edit-user-container">
      <div class="edit-user-content">
        <a-form v-if="user" :model="user" :style="{ width: '600px' }" @submit="handleSubmit">
          <!-- 头像 -->
          <a-form-item label="头像">
            <div class="avatar-upload">
              <a-upload
                :custom-request="customRequest"
                :file-list="file ? [file] : []"
                :show-file-list="false"
                @change="onChange"
                @before-upload="beforeUpload"
              >
                <template #upload-button>
                  <div :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''}`">
                    <div class="arco-upload-list-picture custom-upload-avatar">
                      <img :src="file.url ? file.url : user.avatar" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
              <div style="font-size: 12px; color: var(--color-text-3)">
                支持头像格式 jpeg、jpg、png
                <br />
                大小不超过1mb
              </div>
            </div>
          </a-form-item>
          <!-- 昵称 -->
          <a-form-item field="nickname" label="昵称">
            <a-input v-model="user.nickname" placeholder="输入昵称" />
          </a-form-item>
          <!-- 简介 -->
          <a-form-item field="nickname" label="简介">
            <a-textarea v-model="user.bio" placeholder="输入简介" />
          </a-form-item>
          <!-- 性别 -->
          <a-form-item field="gender" label="性别">
            <a-radio-group v-model="user.gender">
              <a-radio :value="1">男</a-radio>
              <a-radio :value="0">女</a-radio>
              <a-radio :value="2">未知</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="phone" label="电话">
            <a-input placeholder="输入电话" v-model="user.phone" hide-button />
          </a-form-item>

          <a-form-item field="email" label="邮箱">
            <a-input v-model="user.email" placeholder="输入邮箱" />
          </a-form-item>

          <a-form-item field="birthday" label="生日">
            <a-date-picker style="width: 200px" @change="onChangeBirthday" :default-value="user.birthday" />
          </a-form-item>

          <a-form-item field="school" label="学校">
            <a-input v-model="user.school" placeholder="输入学校" />
          </a-form-item>

          <a-form-item field="major" label="专业">
            <a-input v-model="user.major" placeholder="输入专业" />
          </a-form-item>

          <a-form-item field="position" label="岗位">
            <a-input v-model="user.position" placeholder="输入岗位" />
          </a-form-item>

          <a-form-item field="github" label="github">
            <a-input v-model="user.github" placeholder="输入github" />
          </a-form-item>

          <a-form-item>
            <a-button html-type="submit" type="primary">提交保存</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edit-user {
  min-height: calc(100vh - 58px);
  background-color: var(--theme-bg2);
  .edit-user-container {
    max-width: 1200px;
    padding: 20px 0;
    margin: 0 auto;
    .edit-user-content {
      min-height: calc(100vh - 138px);
      padding: 20px 0;
      background-color: #ffffff;
    }
  }
}
</style>
