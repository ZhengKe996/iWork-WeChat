<template>
  <view class="page">
    <view class="user-info">
      <view class="border-outer">
        <view class="border-inner">
          <image :src="photo" mode="widthFix" class="photo"></image>
        </view>
      </view>
      <view class="summary">
        <view>
          <text class="title">姓名</text>
          <text class="value">{{ username }}</text>
        </view>
        <view>
          <text class="title">部门</text>
          <text class="value">{{ deptName ? deptName : "未知" }}</text>
        </view>
        <view>
          <text class="title">状态</text>
          <text class="value">在职</text>
        </view>
      </view>
    </view>
    <view class="list-title">用户信息栏目</view>
    <uni-list>
      <uni-list-item title="个人资料" link to="" />
      <uni-list-item title="我的考勤" link to="../my-checkin/my-checkin" />
      <uni-list-item title="罚款记录" link to="" />
    </uni-list>
    <view class="list-title">系统管理栏目</view>
    <uni-list>
      <uni-list-item
        title="员工管理"
        v-show="checkPermission(['ROOT', 'EMPLOYEE:SELECT'])"
        link
        to=""
      />
      <uni-list-item
        title="部门管理"
        v-show="checkPermission(['ROOT', 'DEPT:SELECT'])"
        link
        to=""
      />
      <uni-list-item
        title="权限管理"
        v-show="checkPermission(['ROOT', 'ROLE:SELECT'])"
        link
        to=""
      />
    </uni-list>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { NetWork } from "@/service";
import { searchUserSummary } from "@/config";
import { checkPermission } from "@/utils";

import uniList from "@/components/uni-list/uni-list";
import uniListItem from "@/components/uni-list-item/uni-list-item";
const username = ref("");
const deptName = ref("");
const photo = ref("");
onLoad(() => {
  NetWork({
    url: searchUserSummary,
    method: "GET",
    fun: (res) => {
      const result = res.data.result;
      username.value = result.name;
      photo.value = result.photo;
      deptName.value = result.deptName;
    },
  });
});
</script>

<style lang="less" scoped>
@import url("./mine.less");
</style>
