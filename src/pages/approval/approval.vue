<template>
  <view class="page" v-if="checkPermission(['WORKFLOW:APPROVAL'])">
    <view class="meeting" v-if="processType == 'meeting'">
      <view class="header">{{ title }}</view>
      <view class="attr">
        <view class="list">
          <view class="item">
            <view class="key">日期</view>
            <text class="value">{{ date }}</text>
          </view>
          <view class="item">
            <view class="key">开始时间</view>
            <text class="value">{{ start }}</text>
          </view>
          <view class="item">
            <view class="key">结束时间</view>
            <text class="value">{{ end }}</text>
          </view>
          <view class="item">
            <view class="key">会议类型</view>
            <text class="value">{{ typeArray[typeIndex] }}</text>
          </view>
          <view class="item" v-if="typeArray[typeIndex] == '线下会议'">
            <view class="key">地点</view>
            <view class="value">{{ place }}</view>
          </view>
        </view>
        <view>
          <text class="desc">{{ desc }}</text>
        </view>
      </view>
      <view class="members">
        <view class="number">参会者（{{ members.length }}人）</view>
        <view class="member">
          <view class="user" v-for="item in members" :key="item.id">
            <image :src="item.photo" mode="widthFix" class="photo"></image>
            <text class="name">{{ item.name }}</text>
          </view>
        </view>
      </view>
      <block v-if="taskId === 3">
        <button class="btn" @tap="approvalMeeting(1)" type="primary">
          同意
        </button>
        <button class="btn" @tap="approvalMeeting(2)" type="warn">
          不同意
        </button>
      </block>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { searchMeetingById, updateExamineMeeting } from "@/config";
import { NetWork } from "@/service";
import { checkPermission } from "@/utils";
const processType = ref();
const taskId = ref(0);
const id = ref();
const uuid = ref();
const title = ref("");
const date = ref("");
const start = ref("");
const end = ref("");
const typeArray = ref(["在线会议", "线下会议"]);
const typeIndex = ref(0);
const place = ref("");
const desc = ref("");
const members = ref([]);

const approvalMeeting = (value) => {
  const approval = value === 1 ? "同意" : "不同意";

  uni.showModal({
    title: "提示信息",
    content: "你" + approval + "这条申请？",
    success: (res) => {
      NetWork({
        url: updateExamineMeeting,
        method: "POST",
        data: {
          id: id.value,
          status: value,
        },
        fun: (res) => {
          uni.showToast({
            icon: "success",
            title: "处理完成",
            complete: () => {
              setTimeout(() => {
                uni.navigateBack({});
              }, 2000);
            },
          });
        },
      });
    },
  });
};

onLoad((options) => {
  id.value = options.id;
  processType.value = options.processType;
});
onShow(() => {
  NetWork({
    url: searchMeetingById,
    method: "POST",
    data: { id: id.value },
    fun: (res) => {
      const result = res.data.result;
      uuid.value = result.uuid;
      title.value = result.title;
      date.value = result.date;
      start.value = dayjs(result.START).format("HH:mm");
      end.value = dayjs(result.END).format("HH:mm");
      typeIndex.value = result.type - 1;
      place.value = result.place;
      const currentDesc = result.desc;
      if (currentDesc != null && currentDesc != "") {
        desc.value = currentDesc;
      }
      members.value = result.members;
      taskId.value = result.STATUS;
    },
    err: (err) => {},
  });
});
</script>

<style lang="less" scoped>
@import url("./approval.less");
</style>
