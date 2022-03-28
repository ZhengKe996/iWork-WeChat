<template>
  <view class="page">
    <image src="@/static/logo-3.jpg" mode="widthFix" class="logo" />
    <view
      class="add"
      v-if="checkPermission(['ROOT', 'MEETING:INSERT'])"
      @tap="toMeetingPage(null, 'insert')"
    >
      <image src="@/static/icon-17.png" mode="widthFix" class="icon" />
      <text>创建会议</text>
    </view>
    <view v-for="item in list" :key="item.date">
      <view class="list-title">{{
        dayjs(item.date).format("YYYY年MM月DD日")
      }}</view>
      <view
        class="item"
        v-for="meeting in item.list"
        :key="meeting.id"
        @longpress="deleteById(meeting.id, meeting.START)"
      >
        <view class="header">
          <view class="left">
            <image
              v-if="meeting.type === '线上会议'"
              src="@/static/icon-11.png"
              mode="widthFix"
              class="icon"
            />
            <image
              v-if="meeting.type === '线下会议'"
              src="@/static/icon-11.png"
              mode="widthFix"
              class="icon"
            />
            <text>{{ meeting.type }}</text>
            <text
              :class="
                dayjs().valueOf() <= dayjs(meeting.START).valueOf()
                  ? 'blue'
                  : 'red'
              "
            >
              （{{
                dayjs().valueOf() <= dayjs(meeting.START).valueOf()
                  ? "未开始"
                  : "已结束"
              }}）
            </text>
          </view>
          <view
            class="right"
            @tap="toMeetingPage(meeting.id, 'edit')"
            v-if="
              checkPermission(['ROOT', 'MEETING:UPDATE']) &&
                meeting.STATUS === 1
            "
          >
            <text>编辑</text>
          </view>
        </view>
        <view class="content">
          <view class="title">{{ meeting.title }}</view>
          <view class="attr">
            <view class="timer">
              <image src="@/static/icon-14.png" mode="widthFix" class="icon" />
              <text
                >{{ dayjs(meeting.START).format("HH:mm") }} ~
                {{ dayjs(meeting.END).format("HH:mm") }}</text
              >
            </view>
            <view class="creator">
              <image src="@/static/icon-15.png" mode="widthFix" class="icon" />
              <text>{{ meeting.NAME }}</text>
            </view>
            <view class="place" v-if="meeting.type != '线上会议'">
              <image src="@/static/icon-16.png" mode="widthFix" class="icon" />
              <text>{{ meeting.place }}</text>
            </view>
          </view>
          <view class="desc">{{ meeting.DESC }}</view>
          <button
            class="btn"
            v-if="meeting.type == '线上会议'"
            @tap="enter(meeting.id, meeting.uuid, meeting.date, meeting.START)"
          >
            进入
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow, onReachBottom } from "@dcloudio/uni-app";
import { searchMyMeetingListByPage, deleteMeetingById } from "@/config";
import { NetWork } from "@/service";
import { checkPermission } from "@/utils";
import dayjs from "dayjs";
const page = ref(1);
const length = ref(20);
const list = ref([]);
const isLastPage = ref(false);

const getMeetingList = () => {
  NetWork({
    url: searchMyMeetingListByPage,
    method: "POST",
    data: {
      page: page.value,
      length: length.value,
    },
    fun: (res) => {
      const result = res.data.result;
      if (result == null || result.length == 0) {
        isLastPage.value = true;
        page.value = page.value - 1;
        if (page.value > 1) {
          uni.showToast({
            icon: "none",
            title: "已经到底了",
          });
        }
      } else {
        for (const item of result) {
          for (const meeting of item.list) {
            if (meeting.type == 1) {
              meeting.type = "线上会议";
            } else if (meeting.type == 2) {
              meeting.type = "线下会议";
            }

            if (meeting.status == 3) {
              meeting.status = "未开始";
            } else if (meeting.status == 4) {
              meeting.status = "进行中";
            }
          }
          if (list.value.length > 0) {
            let last = list.value[list.value.length - 1];
            if (last.date == item.date) {
              last.list = last.list.concat(item.list);
            } else {
              list.value.push(item);
            }
          } else {
            list.value.push(item);
          }
        }
      }
    },
    err: (err) => {},
  });
};

const toMeetingPage = (id, opt) => {
  uni.navigateTo({
    url: "../meeting/meeting?id=" + id + "&opt=" + opt,
  });
};
const deleteById = (id, start) => {
  if (
    dayjs().valueOf() >=
    dayjs(start)
      .subtract(20, "minute")
      .valueOf()
  ) {
    uni.showToast({
      icon: "none",
      title: "该会议无法删除",
    });
    return;
  }
  uni.vibrateShort({});
  uni.showModal({
    title: "提示信息",
    content: "是否删除这个会议？",
    success: (res) => {
      if (res.confirm) {
        NetWork({
          url: deleteMeetingById,
          method: "POST",
          data: { id: id },
          fun: (res) => {
            uni.showToast({
              icon: "success",
              title: "删除成功",
              complete: () => {
                setTimeout(() => {
                  page.value = 1;
                  isLastPage.value = false;
                  uni.pageScrollTo({
                    scrollTop: "0",
                  });
                  list.value = [];
                  getMeetingList();
                }, 2000);
              },
            });
          },
          err: (err) => {
            uni.showToast({
              icon: "error",
              title: `删除失败`,
            });
          },
        });
      }
    },
  });
};
onShow(() => {
  page.value = 1;
  isLastPage.value = false;
  list.value = [];
  getMeetingList();
});
onReachBottom(() => {
  if (isLastPage.value) {
    return;
  }
  page.value = page.value + 1;
  getMeetingList();
});
</script>

<style lang="less" scoped>
@import url("./meeting-list.less");
</style>
