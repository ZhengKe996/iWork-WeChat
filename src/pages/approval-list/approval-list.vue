<template>
  <view class="page" v-if="checkPermission(['WORKFLOW:APPROVAL'])">
    <uni-segmented-control
      :current="current"
      :values="items"
      @clickItem="onClickItem"
      style-type="button"
      active-color="#3474FF"
    >
    </uni-segmented-control>
    <view class="list" v-if="current == 0">
      <view class="item" v-for="item in list" :key="item.id">
        <view class="left">
          <image :src="item.photo" mode="widthFix" class="photo"></image>
          <view class="name">{{ item.NAME }}</view>
          <view class="desc">（发起）</view>
        </view>
        <view class="center">
          <view class="title">
            部门{{ item.type ? "线上会议" : "线下会议" }}申请
          </view>
          <view>日期：{{ dayjs(item.date).format("YYYY年MM月DD日") }}</view>
          <view
            >时长：{{
              item.HOUR / 1000 / 60 / 60 >= 1
                ? parseInt(item.HOUR / 1000 / 60 / 60)
                : "小于 1"
            }}
            小时
          </view>
          <view class="status">状态：待审批</view>
        </view>
        <view class="right">
          <button class="btn" @tap="toPage(item.id)">
            审批
          </button>
        </view>
      </view>
    </view>
    <view class="list" v-if="current == 1">
      <view
        class="item"
        v-for="item in list"
        :key="item.id"
        @tap="toPage(item.id)"
      >
        <view class="left">
          <image :src="item.photo" mode="widthFix" class="photo"></image>
          <view class="name">{{ item.NAME }}</view>
          <view class="desc">（发起）</view>
        </view>
        <view class="center">
          <view class="title">
            部门{{ item.type ? "线上会议" : "线下会议" }}申请
          </view>
          <view class="attr">
            日期：{{ dayjs(item.date).format("YYYY年MM月DD日") }}
          </view>
          <view class="attr">
            时长：{{
              item.HOUR / 1000 / 60 / 60 >= 1
                ? parseInt(item.HOUR / 1000 / 60 / 60)
                : "小于 1"
            }}
            小时
          </view>
          <view class="attr">
            最终结果：
            <text class="result" v-if="item.STATUS == null">等待中</text>
            <text v-else :class="`${item.STATUS === 1 ? 'green' : 'red'}`">{{
              item.STATUS === 1 ? "同意" : "不同意"
            }}</text>
          </view>
        </view>
        <view class="right">
          <block v-if="item.STATUS === 1">
            <image :src="item.managerPhoto" mode="widthFix" class="icon" />
            <view class="name">{{ item.managerName }}</view>
            <view class="desc">（终审）</view>
          </block>
          <block v-if="item.STATUS == 2">
            <image src="@/static/icon-20.png" mode="widthFix" class="icon" />
            <view class="desc">审批进行中</view>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow, onReachBottom } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { searchExamineMeetingList } from "@/config";
import { NetWork } from "@/service";
import { checkPermission } from "@/utils";
import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue";
const page = ref(1);
const length = ref(20);
const list = ref([]);
const isLastPage = ref(false);
const items = ref(["待审批", "已审批"]);
const current = ref(0);
const status = ref(3);
const onClickItem = (event) => {
  current.value = event.currentIndex;
  if (current.value === 0) {
    status.value = 3;
  } else {
    status.value = 1;
  }
  page.value = 1;
  list.value = [];
  isLastPage.value = false;
  getData();
};
const getData = () => {
  NetWork({
    url: searchExamineMeetingList,
    method: "POST",
    data: {
      page: page.value,
      length: length.value,
      status: status.value,
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
          list.value.push(item);
        }
      }
    },
  });
};
const toPage = (id) => {
  const url = `../approval/approval?id=${id}&processType=meeting`;
  uni.navigateTo({
    url: url,
  });
};
onShow(() => {
  page.value = 1;
  list.value = [];
  isLastPage.value = false;
  getData();
});
onReachBottom(() => {
  if (isLastPage.value) {
    return;
  }
  page.value = page.value + 1;
  getData();
});
</script>

<style lang="less" scoped>
@import url("./approval-list.less");
</style>
