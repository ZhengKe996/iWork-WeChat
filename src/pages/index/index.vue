<template>
  <view class="page">
    <swiper circular="true" interval="8000" duration="1000" class="swiper">
      <swiper-item>
        <image
          mode="widthFix"
          src="https://coco-img.oss-cn-hangzhou.aliyuncs.com/iwork_banner/swiper-1.jpg"
        ></image>
      </swiper-item>
      <swiper-item>
        <image
          mode="widthFix"
          src="https://coco-img.oss-cn-hangzhou.aliyuncs.com/iwork_banner/swiper-2.jpg"
        ></image>
      </swiper-item>
      <swiper-item>
        <image
          mode="widthFix"
          src="https://coco-img.oss-cn-hangzhou.aliyuncs.com/iwork_banner/swiper-3.jpg"
        ></image>
      </swiper-item>
      <swiper-item>
        <image
          mode="widthFix"
          src="https://coco-img.oss-cn-hangzhou.aliyuncs.com/iwork_banner/swiper-4.jpg"
        ></image>
      </swiper-item>
      <swiper-item>
        <image
          mode="widthFix"
          src="https://coco-img.oss-cn-hangzhou.aliyuncs.com/iwork_banner/swiper-5.jpg"
        ></image>
      </swiper-item>
    </swiper>

    <view
      class="notify-container"
      @tap="toPage('消息提醒', '../message-list/message-list')"
    >
      <view class="notify-title">
        <image src="@/static/icon-1.png" mode="widthFix" class="notify-icon" />
        消息提醒
      </view>
      <view class="notify-content"> 你有{{ unreadRows }}条未读消息 </view>
      <image src="@/static/icon-2.png" mode="widthFix" class="more-icon" />
    </view>

    <view class="nav-container">
      <view class="nav-row">
        <view class="nav">
          <image
            mode="widthFix"
            src="@/static/nav-1.png"
            class="icon"
            @tap="toPage('在线签到', '../checkin/checkin')"
          />
          <text class="name">在线签到</text>
        </view>
        <view class="nav">
          <image src="@/static/nav-2.png" mode="widthFix" class="icon" />
          <text class="name">员工健康</text>
        </view>
        <view class="nav">
          <image src="@/static/nav-3.png" mode="widthFix" class="icon" />
          <text class="name">在线请假</text>
        </view>
        <view class="nav">
          <image src="@/static/nav-4.png" mode="widthFix" class="icon" />
          <text class="name">公务出差</text>
        </view>
      </view>
      <view class="nav-row">
        <view class="nav">
          <image src="@/static/nav-5.png" mode="widthFix" class="icon" />
          <text class="name">员工日报</text>
        </view>
        <view class="nav">
          <image src="@/static/nav-6.png" mode="widthFix" class="icon" />
          <text class="name">我的加班</text>
        </view>
        <view class="nav">
          <image src="@/static/nav-7.png" mode="widthFix" class="icon" />
          <text class="name">付款申请</text>
        </view>
        <view class="nav">
          <image src="@/static/nav-8.png" mode="widthFix" class="icon" />
          <text class="name">费用报销</text>
        </view>
      </view>
      <view class="nav-row">
        <view class="nav">
          <image src="@/static/nav-9.png" mode="widthFix" class="icon" />
          <text class="name">公告通知</text>
        </view>
        <view class="nav">
          <image
            src="@/static/nav-10.png"
            mode="widthFix"
            class="icon"
            @tap="toPage('在线审批', '../approval-list/approval-list')"
          />
          <text class="name">在线审批</text>
        </view>
        <view class="nav">
          <image src="@/static/nav-11.png" mode="widthFix" class="icon" />
          <text class="name">物品领用</text>
        </view>
        <view class="nav">
          <image src="@/static/nav-12.png" mode="widthFix" class="icon" />
          <text class="name">采购申请</text>
        </view>
      </view>
    </view>
    <view class="calendar-container">
      <template v-if="flag">
        <uni-calendar
          :insert="true"
          :lunar="false"
          :selected="calendar"
          :date="changeDate"
          @monthSwitch="changeMonth"
          @confirm="changeMonth"
        />
      </template>
      <template v-else>
        <uni-calendar :insert="true" :date="changeDate" :lunar="false" />
      </template>
    </view>
    <view class="meeting-container" v-for="item in meetingList" :key="item.id">
      <view class="meeting">
        <view class="row">
          <text class="title">{{ item.title }}</text>
          <text class="hours"
            >时长:
            {{
              item.HOUR / 1000 / 60 / 60 >= 1
                ? parseInt(item.HOUR / 1000 / 60 / 60)
                : "小于 1"
            }}
            小时</text
          >
        </view>
        <view class="row">
          <image src="@/static/icon-3.png" mode="widthFix" class="icon" />
          <text class="desc" space="emsp"
            >日期: {{ dayjs(item.date).format("YYYY年MM月DD日") }}
            {{ dayjs(item.start).format("HH:mm") }}
          </text>
        </view>
        <view class="row">
          <image src="@/static/icon-4.png" mode="widthFix" class="icon" />
          <text class="desc"
            >地点: {{ item.type == "线上会议" ? item.type : item.place }}</text
          >
        </view>
        <image :src="item.photo" class="photo" />
      </view>
    </view>
    <uni-popup ref="popupMsg" type="top">
      <uni-popup-message
        type="success"
        :message="`接收到${lastRows}条消息`"
        :duration="1000"
      />
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  onShow,
  onUnload,
  onHide,
  onLoad,
  onReachBottom,
} from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { NetWork } from "@/service";
import {
  refreshMessage,
  searchMyMeetingListByPage,
  searchUserMeetingInMonth,
} from "@/config";
import uniPopup from "@/components/uni-popup/uni-popup";
import uniPopupMessage from "@/components/uni-popup-message/uni-popup-message";
import uniCalendar from "@/components/uni-calendar/uni-calendar.vue";
const popupMsg = ref();
const unreadRows = ref(0);
const lastRows = ref(0);
const timer = ref();
const calendar = ref([]);
const meetingPage = ref(1);
const meetingLength = ref(20);
const meetingList = ref([]);
const isMeetingLastPage = ref(false);
const year = ref(dayjs().format("YYYY"));
const month = ref(dayjs().format("MM"));
const changeDate = ref();
const flag = ref(false);

const toPage = (name, url) => {
  uni.navigateTo({
    url: url,
  });
};

const getMessage = () => {
  NetWork({
    url: refreshMessage,
    method: "GET",
    fun: (res) => {
      unreadRows.value = res.data.unreadRows;
      lastRows.value = res.data.lastRows;

      if (lastRows.value > 0) {
        uni.$emit("showMessage");
      }
    },
    err: (err) => {
      console.log(err);
    },
  });
};
const getMeetingList = () => {
  NetWork({
    url: searchMyMeetingListByPage,
    method: "POST",
    data: {
      page: meetingPage.value,
      length: meetingLength.value,
    },
    fun: (res) => {
      const result = res.data.result;
      if (result == null || result.length == 0) {
        isMeetingLastPage.value = true;
        meetingPage.value = meetingPage.value - 1;
        if (meetingPage.value > 1) {
          uni.showToast({
            icon: "none",
            title: "已经到底了",
          });
        }
      } else {
        const list = [];
        for (const item of result) {
          for (const meeting of item.list) {
            if (meeting.type == 1) {
              meeting.type = "线上会议";
            } else if (meeting.type == 2) {
              meeting.type = "线下会议";
            }
            if (meeting.status == 1) {
              meeting.status = "未开始";
            } else if (meeting.status == 4) {
              meeting.status = "进行中";
            }
            list.push(meeting);
          }
        }
        meetingList.value = list;
      }
    },
  });
};
const getMeetingInMonth = () => {
  flag.value = false;
  calendar.value = [];
  NetWork({
    url: searchUserMeetingInMonth,
    method: "POST",
    data: {
      year: year.value,
      month: month.value,
    },
    fun: (res) => {
      for (const item of res.data.result) {
        calendar.value.push({ date: item, info: "会议" });
      }
      flag.value = true;
    },
  });
};
const changeMonth = (event) => {
  year.value = event.year;
  month.value = event.month;
};

watch([year, month], () => {
  changeDate.value = `${year.value}-${month.value}-01`;
  getMeetingInMonth();
});
onLoad(() => {
  uni.$on("showMessage", () => {
    popupMsg.value.open();
    setTimeout(() => {
      popupMsg.value.close();
    }, 3000);
  });

  getMessage();
});

onShow(() => {
  timer.value = setInterval(() => {
    getMessage();
  }, 5000);
  meetingPage.value = 1;
  isMeetingLastPage.value = false;
  meetingList.value = [];
  getMeetingList();
  getMeetingInMonth();
});

onHide(() => {
  clearInterval(timer.value);
});
onUnload(() => {
  uni.$off("showMessage");
});
onReachBottom(() => {
  if (isMeetingLastPage.value) {
    return;
  }
  meetingPage.value = meetingPage.value + 1;
  getMeetingList;
});
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
