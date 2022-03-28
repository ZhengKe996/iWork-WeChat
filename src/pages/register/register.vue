<template>
  <view>
    <image src="@/static/logo-2.png" mode="widthFix" class="logo" />
    <view class="register-container">
      <input
        type="text"
        placeholder="请输入你的邀请码"
        class="register-code"
        maxlength="6"
        v-model="registerCode"
      />
      <view class="register-desc">
        管理员创建个人账号之后，你可以从你的个人邮箱中获得注册邀请码
      </view>
      <button class="register-btn" open-type="getUserInfo" @tap="Register()">
        执行注册
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { NetWork } from "@/service";
import { register } from "@/config";
const registerCode = ref("");

const Register = () => {
  if (registerCode.value == null || registerCode.value.length == 0) {
    uni.showToast({
      icon: "none",
      title: "邀请码不能为空",
    });
    return;
  } else if (/^[0-9]{6}$/.test(registerCode.value) == false) {
    uni.showToast({
      icon: "none",
      title: "邀请码必须是6位数字",
    });
    return;
  }

  uni.login({
    provider: "weixin",
    success: (resp) => {
      const code = resp.code;
      console.log(code);
      uni.getUserInfo({
        provider: "weixin",
        success: (resp) => {
          const nickName = resp.userInfo.nickName;
          const avatarUrl = resp.userInfo.avatarUrl;

          const data = {
            code: code,
            nickname: nickName,
            photo: avatarUrl,
            registerCode: registerCode.value,
          };
          NetWork({
            url: register,
            method: "POST",
            data: data,
            fun: (res) => {
              const permission = res.data.permission;
              uni.setStorageSync("permission", permission);

              uni.switchTab({
                url: "../index/index",
              });
            },
          });
        },
      });
    },
  });
};
</script>

<style lang="less" scoped>
@import url("./register.less");
</style>
