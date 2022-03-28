<template>
  <view class="statistics">
    <image src="@/static/big-icon-1.png" class="big-icon" mode="widthFix" />
    <view class="report-title">
      <text class="days">{{ sumOK }}</text>
      <text class="unit">天</text>
    </view>
    <view class="sub-title">
      <text>本月签到</text>
    </view>
    <view class="report">
      <view class="column green">
        <text class="column-title">正常签到</text>
        <text class="number">{{ sumOK }}</text>
      </view>
      <view class="column orange">
        <text class="column-title">迟到签到</text>
        <text class="number">{{ sumLate }}</text>
      </view>
      <view class="column red">
        <text class="column-title">缺勤签到</text>
        <text class="number">{{ sumAbsenteeism }}</text>
      </view>
    </view>
  </view>
  <view class="calendar-container">
    <template v-if="flag">
      <uni-calendar
        :insert="true"
        :lunar="false"
        :date="changeDate"
        :selected="list"
        @monthSwitch="changeMonth"
        @confirm="changeMonth"
      />
    </template>
    <template v-else>
      <uni-calendar :insert="true" :date="changeDate" :lunar="false" />
    </template>
  </view>
</template>

<script setup>
import { ref, reactive, onBeforeMount, watch } from "vue";
import { NetWork } from "@/service";
import { searchMonthCheckin } from "@/config";
import uniCalendar from "@/components/uni-calendar/uni-calendar";
const list = reactive([]);
// 正常天数
const sumOK = ref(0);

// 迟到天数
const sumLate = ref(0);

// 缺勤天数
const sumAbsenteeism = ref(0);

const year = ref();
const month = ref();
const changeDate = ref();
const flag = ref(false);

const date = new Date();
month.value = date.getMonth() + 1;
year.value = date.getFullYear();

watch([year, month], () => {
  changeDate.value = `${year.value}-${month.value}-01`;
  searchCheckin(year.value, month.value);
});

const searchCheckin = (year, month) => {
  sumOK.value = 0;
  sumLate.value = 0;
  sumAbsenteeism.value = 0;
  list.length = 0;
  flag.value = false;

  NetWork({
    url: searchMonthCheckin,
    method: "POST",
    data: { year: year, month: month },
    fun: (res) => {
      for (const one of res.data.list) {
        if (one.status !== null && one.status !== "") {
          let color = "";
          if (one.status == "正常") {
            color = "green";
          } else if (one.status == "迟到") {
            color = "orange";
          } else if (one.status == "缺勤") {
            color = "red";
          }
          list.push({
            date: one.date,
            info: one.status,
            color: color,
          });
        }
      }
      sumOK.value = res.data.sumOK;
      sumLate.value = res.data.sumLate;
      sumAbsenteeism.value = res.data.sumAbsenteeism;
      flag.value = true;
    },
    err: (error) => {
      uni.showToast({
        title: error.data.msg,
        icon: "none",
      });
    },
  });
};

onBeforeMount(() => {
  searchCheckin(year.value, month.value);
});

const changeMonth = (event) => {
  year.value = event.year;
  month.value = event.month;
};
</script>

<style lang="less" scoped>
@import url("./my-checkin.less");
</style>
