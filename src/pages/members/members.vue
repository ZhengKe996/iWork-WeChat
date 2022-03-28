<template>
  <view class="page">
    <button class="btn" @click="confirm">确认</button>
    <checkbox-group @change="selected">
      <block v-for="dept in list" :key="dept.id">
        <view class="list-title"
          >{{ dept.deptName }}（{{ dept.count }}人）</view
        >
        <view class="item" v-for="member in dept.members" :key="member.userId">
          <view class="key">{{ member.name }}</view>
          <checkbox
            class="value"
            :value="member.userId"
            :checked="member.checked"
          />
        </view>
      </block>
    </checkbox-group>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { searchUserGroupByDept } from "@/config";
import { NetWork } from "@/service";
const list = ref([]);
const members = ref([]);

const getData = () => {
  NetWork({
    url: searchUserGroupByDept,
    method: "POST",
    data: {
      keyword: "",
    },
    fun: (res) => {
      const result = res.data.result;
      list.value = result;
      for (const dept of list.value) {
        for (const member of dept.members) {
          if (members.value.indexOf(member.userId + "") != -1) {
            member.checked = true;
          } else {
            member.checked = false;
          }
        }
      }
    },
    err: (err) => {},
  });
};

const selected = (event) => {
  members.value = event.detail.value;
};

const confirm = () => {
  uni.$emit("updateData", members.value);
  uni.navigateBack({
    delta: 1,
  });
};
onShow(() => {
  getData();
});
onLoad((options) => {
  if (options.hasOwnProperty("members")) {
    const pageMembers = options.members;
    members.value = pageMembers.split(",");
  }
});
</script>

<style lang="less" scoped>
@import url("./members.less");
</style>
