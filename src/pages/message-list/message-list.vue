<template>
  <view class="page">
    <uni-list>
      <uni-list-chat
        v-for="item in list"
        :key="item.id"
        :title="item.senderName"
        :note="item.msg"
        :avatar="item.senderPhoto"
        badgePositon="left"
        :badgeText="item.readFlag ? '' : 'dot'"
        link="navigateTo"
        :to="
          `../message/message?id=${item.id}&readFlag=${item.readFlag}&refId=${item.refId}`
        "
      >
        <view class="chat-custom-right">
          <text class="chat-custom-text">{{ item.sendTime }}</text>
        </view>
      </uni-list-chat>
    </uni-list>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onReachBottom, onShow } from "@dcloudio/uni-app";
import { searchMessageByPage } from "@/config";
import { NetWork } from "@/service";
import uniList from "@/components/uni-list/uni-list";
import uniListChat from "@/components/uni-list-chat/uni-list-chat";
const page = ref(1);
const length = ref(20);
const list = ref([]);
const isLastPage = ref(false);

const loadMessageList = () => {
  const data = {
    page: page.value,
    length: length.value,
  };

  NetWork({
    url: searchMessageByPage,
    method: "POST",
    data: data,
    fun: (res) => {
      const result = res.data.result;
      if (result == null || result.length == 0) {
        isLastPage.value = true;
        page.value = page.value - 1;
        uni.showToast({
          icon: "none",
          title: "已经到底了",
        });
      } else {
        if (page.value == 1) {
          list.value = [];
        }
        list.value = list.value.concat(result);
        if (page.value > 1) {
          uni.showToast({
            icon: "none",
            title: "新加载" + result.length + "条消息",
          });
        }
      }
    },
    err: (err) => {
      console.log(err);
    },
  });
};

onShow(() => {
  page.value = 1;
  isLastPage.value = false;
  uni.pageScrollTo({
    scrollTop: "0",
  });

  loadMessageList();
});

onReachBottom(() => {
  if (isLastPage.value) {
    return;
  }
  page.value = page.value + 1;
  loadMessageList();
});
</script>

<style lang="less" scoped>
@import url("./message-list.less");
</style>
