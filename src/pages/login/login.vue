<template>
  <view>
    <image src="@/static/logo-1.png" class="logo" mode="widthFix" />
    <view class="logo-title"> '爱蜗壳' 在线 </view>
    <view class="logo-subtitle">Ver 2022.3</view>
    <button class="login-btn" open-type="getUserInfo" @tap="Login()">
      登录系统
    </button>

    <view class="register-container">
      没有账号？
      <text class="register" @tap="toRegister()">立即注册</text>
    </view>
  </view>
</template>

<script setup>
import { NetWork } from "@/service";
import { login } from "@/config";

const toRegister = () => {
  uni.navigateTo({
    url: "../register/register",
  });
};

const Login = () => {
  uni.login({
    provider: "weixin",
    success: function(resp) {
      const code = resp.code;
      NetWork({
        url: login,
        method: "POST",
        data: { code: code },
        fun: (res) => {
          console.log(res);
          const permission = res.data.permission;
          uni.setStorageSync("permission", permission);
          uni.switchTab({
            url: "../index/index",
          });
        },
        err: (error) => {
          uni.navigateTo({
            url: "../register/register",
          });
        },
      });
    },
    fail: (error) => {
      uni.showToast({
        icon: "none",
        title: "执行异常",
      });
    },
  });
};
</script>

<style lang="less" scoped>
@import url("./login.less");
</style>
