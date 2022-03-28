<template>
  <view class="message">
    <view class="header">
      <view class="desc">{{ sendTime }}</view>
      <view class="opt" @tap="deleteMsg()">删除</view>
    </view>
    <view class="content">{{ msg }}</view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { NetWork } from "@/service";
import {
  searchMessageById,
  updateUnreadMessage,
  deleteMessageRefById,
} from "@/config";
const id = ref();
const readFlag = ref();
const refId = ref();
const sendTime = ref("");
const msg = ref("");
onShow(() => {
  uni.setNavigationBarTitle({
    title: "系统通知",
  });
  NetWork({
    url: searchMessageById,
    method: "POST",
    data: { id: id.value },
    fun: (res) => {
      const result = res.data.result;
      sendTime.value = result.sendTime;
      msg.value = result.msg;
    },
    err: (err) => {},
  });
});
onLoad((option) => {
  id.value = option.id;
  readFlag.value = option.readFlag == "true" ? true : false;
  refId.value = option.refId;

  if (!readFlag.value) {
    NetWork({
      url: updateUnreadMessage,
      method: "POST",
      data: { id: refId.value },
      fun: (res) => {},
    });
  }
});

const deleteMsg = () => {
  uni.showModal({
    title: "提示信息",
    content: "是否要删除这条消息？",
    success: () => {
      NetWork({
        url: deleteMessageRefById,
        method: "POST",
        data: { id: refId.value },
        fun: (res) => {
          uni.showToast({
            icon: "success",
            title: "删除成功",
            complete: () => {
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                });
              }, 1000);
            },
          });
        },
      });
    },
  });
};
</script>

<style lang="less" scoped>
@import url("./message.less");
</style>
