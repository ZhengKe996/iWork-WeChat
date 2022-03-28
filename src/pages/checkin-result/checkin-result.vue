<template>
  <view class="page">
    <view class="summary-container">
      <view class="user-info">
        <image :src="photo" mode="widthFix" class="photo"></image>
        <view class="info">
          <text class="username">{{ username }}</text>
          <text class="dept">
            隶属部门：{{ deptName == null ? "" : deptName }}
          </text>
        </view>
      </view>
      <view class="date">{{ dayjs(date).format("YYYY-MM-DD") }}</view>
    </view>
    <view class="result-container">
      <view class="left">
        <image src="@/static/icon-6.png" mode="widthFix" class="icon-timer" />
        <image src="@/static/icon-6.png" mode="widthFix" class="icon-timer" />
        <view class="line"></view>
      </view>
      <view class="right">
        <view class="row">
          <text class="start">上班（时间 {{ attendanceTime }}）</text>
        </view>
        <view class="row">
          <text class="checkin-time">签到时间（{{ checkinTime }}）</text>
          <text class="checkin-result green other" v-if="status == '正常'">
            {{ status }}
          </text>
          <text class="checkin-result yellow other" v-if="status == '迟到'">
            {{ status }}
          </text>
        </view>
        <view class="row">
          <image src="@/static/icon-7.png" mode="widthFix" class="icon-small" />
          <text class="desc">{{ address }}</text>
          <text class="checkin-result green" v-if="risk == '低风险'">
            {{ risk }}
          </text>
          <text class="checkin-result yellow" v-if="risk == '中风险'">
            {{ risk }}
          </text>
          <text class="checkin-result red" v-if="risk == '高风险'">
            {{ risk }}
          </text>
        </view>
        <view class="row">
          <image src="@/static/icon-8.png" mode="widthFix" class="icon-small" />
          <text class="desc">身份验证</text>
          <text class="checkin-result green">已通过</text>
        </view>
        <view class="row">
          <text class="end">下班（时间 {{ closingTime }}）</text>
        </view>
      </view>
    </view>
    <view class="checkin-report">
      <image src="@/static/big-icon-1.png" mode="widthFix" class="big-icon" />
      <view class="report-title">
        <text class="days">{{ checkinDays }}</text>
        <text class="unit">天</text>
      </view>
      <view class="sub-title">
        <text>累计签到</text>
        <view class="line"></view>
      </view>
      <view class="calendar-container">
        <view class="calendar" v-for="one in weekCheckin" :key="one">
          <image
            src="@/static/icon-9.png"
            mode="widthFix"
            class="calendar-icon"
            v-if="one.type == '工作日'"
          />
          <image
            src="@/static/icon-10.png"
            mode="widthFix"
            class="calendar-icon"
            v-if="one.type == '节假日'"
          />
          <text class="day">{{ one.day }}</text>
          <text class="result green" v-if="one.status == '正常'">
            {{ one.status }}
          </text>
          <text class="result yellow" v-if="one.status == '迟到'">
            {{ one.status }}
          </text>
          <text class="result red" v-if="one.status == '缺勤'">
            {{ one.status }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";

import dayjs from "dayjs";
import { searchTodayCheckin } from "@/config";
import { NetWork } from "@/service";

const photo = ref("");
const username = ref("");
const deptName = ref("");
const address = ref("");
const status = ref("");
const risk = ref("");
const checkinTime = ref("");
const date = ref("");
const attendanceTime = ref("");
const closingTime = ref("");
const checkinDays = ref(0);
const weekCheckin = ref([]);

onShow(() => {
  NetWork({
    url: searchTodayCheckin,
    method: "GET",
    fun: (res) => {
      console.log(res);
      const result = res.data.result;
      photo.value = result.photo;
      username.value = result.name;
      deptName.value = result.deptName;
      date.value = result.date;
      attendanceTime.value = result.attendanceTime;
      closingTime.value = result.closingTime;
      checkinTime.value = result.checkinTime;
      status.value = result.status;
      risk.value = result.risk;
      address.value = result.address;
      checkinDays.value = result.checkinDays;
      weekCheckin.value = result.weekCheckin;
    },
    err: (error) => {},
  });
});
</script>

<style lang="less" scoped>
@import url("./checkin-result.less");
</style>
