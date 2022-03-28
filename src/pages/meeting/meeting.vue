<template>
  <view
    class="page"
    v-if="checkPermission(['ROOT', 'MEETING:INSERT', 'MEETING:UPDATE'])"
  >
    <view class="header">
      <input
        type="text"
        class="title"
        v-model="title"
        placeholder="输入会议标题"
        placeholder-class="title-placeholder"
      />
      <image src="@/static/icon-18.png" mode="widthFix" class="edit-icon" />
    </view>
    <view class="attr">
      <view class="list">
        <view class="item">
          <view class="key">日期</view>
          <picker v-if="canEdit" mode="date" :value="date" @change="dateChange">
            <view class="uni-input">{{ date }}</view>
          </picker>
          <text v-if="!canEdit" class="value">{{ date }}</text>
        </view>
        <view class="item">
          <view class="key">开始时间</view>
          <picker
            v-if="canEdit"
            mode="time"
            :value="start"
            @change="startChange"
          >
            <view class="uni-input">{{ start }}</view>
          </picker>
          <text v-if="!canEdit" class="value">{{ start }}</text>
        </view>
        <view class="item">
          <view class="key">结束时间</view>
          <picker v-if="canEdit" mode="time" :value="end" @change="endChange">
            <view class="uni-input">{{ end }}</view>
          </picker>
          <text v-if="!canEdit" class="value">{{ end }}</text>
        </view>
        <view class="item">
          <view class="key">会议类型</view>
          <picker
            v-if="canEdit"
            :value="typeIndex"
            :range="typeArray"
            @change="typeChange"
            >{{ typeArray[typeIndex] }}</picker
          >
          <text v-if="!canEdit" class="value">{{ typeArray[typeIndex] }}</text>
        </view>
        <view
          class="item"
          v-if="typeArray[typeIndex] == '线下会议'"
          @tap="editPlace"
        >
          <view class="key">地点</view>
          <view class="value">{{ place }}</view>
        </view>
      </view>
      <view @tap="editDesc">
        <text class="desc">{{ desc }}</text>
      </view>
    </view>
    <view class="members">
      <view class="number">参会者（{{ members.length }}人）</view>
      <view class="member">
        <view
          class="user"
          v-for="item in members"
          :key="item.id"
          @longpress="deleteMember(item.id)"
        >
          <image :src="item.photo" mode="widthFix" class="photo" />
          <text class="name">{{ item.name }}</text>
        </view>
        <view class="add">
          <image
            src="@/static/icon-19.png"
            mode="widthFix"
            class="add-btn"
            @tap="toMembersPage()"
          />
        </view>
      </view>
    </view>
    <button class="btn" @tap="save">保存</button>
    <uni-popup ref="popupPlace" type="dialog">
      <uni-popup-dialog
        mode="input"
        title="编辑文字内容"
        placeholder="输入会议地点"
        :value="place"
        @confirm="finishPlace"
      />
    </uni-popup>
    <uni-popup ref="popupDesc" type="dialog">
      <uni-popup-dialog
        mode="input"
        title="会议地点"
        placeholder="输入会议内容"
        :value="desc"
        @confirm="finishDesc"
      />
    </uni-popup>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import {
  searchMembers,
  insertMeeting,
  updateMeetingInfo,
  searchMeetingById,
} from "@/config";
import { NetWork } from "@/service";
import { checkPermission, checkBlank, checkValidStartAndEnd } from "@/utils";
import uniPopup from "@/components/uni-popup/uni-popup";
import uniPopupDialog from "@/components/uni-popup-dialog/uni-popup-dialog";

const opt = ref();
const id = ref();
const uuid = ref();
const canEdit = ref(true);
const title = ref("");
const date = ref("");
const start = ref("");
const end = ref("");
const typeArray = ref(["线上会议", "线下会议"]);
const typeIndex = ref(0);
const place = ref("");
const desc = ref("会议内容");
const members = ref([]);
const instanceId = ref();

const popupPlace = ref();
const popupDesc = ref();

const toMembersPage = () => {
  const array = [];
  for (const item of members.value) {
    array.push(item.id);
  }
  uni.navigateTo({
    url: "../members/members?members=" + array.join(","),
  });
};

const dateChange = (event) => {
  date.value = event.detail.value;
};
const startChange = (event) => {
  start.value = event.detail.value;
};
const endChange = (event) => {
  end.value = event.detail.value;
};
const typeChange = (event) => {
  typeIndex.value = event.detail.value;
};
const editPlace = () => {
  if (!canEdit.value) {
    return;
  }
  popupPlace.value.open();
};
const finishPlace = (value) => {
  if (value != null && value != "") {
    place.value = value;
  } else {
    uni.showToast({
      icon: "none",
      title: "地点不能为空",
    });
  }
};
const editDesc = () => {
  if (!canEdit.value) {
    return;
  }
  popupDesc.value.open();
};
const finishDesc = (value) => {
  if (value != null && value != "") {
    desc.value = value;
  } else {
    uni.showToast({
      icon: "none",
      title: "地点不能为空",
    });
  }
};

const save = () => {
  const array = [];
  for (const item of members.value) {
    array.push(item.id);
  }
  if (
    checkBlank(title.value, "会议题目") ||
    checkValidStartAndEnd(start.value, end.value) ||
    (typeIndex.value === "1" && checkBlank(place.value, "会议地点")) ||
    checkBlank(desc.value, "会议内容") ||
    array.length === 0
  )
    return;
  const timeStart = date.value + " " + start.value + ":00";
  const timeEnd = date.value + " " + end.value + ":00";

  const data = {
    title: title.value,
    date: date.value,
    start: dayjs(timeStart).valueOf(),
    end: dayjs(timeEnd).valueOf(),
    type: Number(typeIndex.value) + 1,
    members: JSON.stringify(array),
    desc: desc.value,
    id: id.value,
    instanceId: instanceId.value,
    place: place.value,
  };
  if (typeIndex === "1") {
    data.place = place.value;
  }
  let url = "";
  if (opt.value === "insert") {
    url = insertMeeting;
  } else if (opt.value === "edit") {
    url = updateMeetingInfo;
  }

  NetWork({
    url: url,
    method: "POST",
    data: data,
    fun: (res) => {
      uni.showToast({
        icon: "success",
        title: "保存成功",
        complete: () => {
          setTimeout(() => {
            uni.navigateBack({});
          }, 2000);
        },
      });
    },
    err: (err) => {
      console.log(err);
    },
  });
};
const deleteMember = (id) => {
  uni.vibrateShort({});
  uni.showModal({
    title: "提示信息",
    content: "删除该名参会人员？",
    success: () => {
      let postion;
      for (let i = 0; i < members.value.length; i++) {
        let item = members.value[i];
        if (item.id == id) {
          postion = i;
          break;
        }
      }
      members.value.splice(postion, 1);
    },
  });
};

onShow(() => {
  // 当用户从成员列表进入触发
  uni.$on("updateData", (res) => {
    const current = [];
    // 将数组中的字符串转为数字
    for (let item of res) {
      current.push(Number(item));
    }

    NetWork({
      url: searchMembers,
      method: "POST",
      data: { members: JSON.stringify(current) },
      fun: (res) => {
        const result = res.data.result;
        members.value = result;
      },
      err: (err) => {},
    });
  });
});
onLoad((options) => {
  id.value = options.id;
  opt.value = options.opt;

  // 判断 编辑/新增会议
  if (opt.value === "insert") {
    const now = new Date();
    date.value = dayjs(now).format("YYYY-MM-DD");
    start.value = dayjs(now)
      .add(30, "minute")
      .format("HH:mm");
    end.value = dayjs(now)
      .add(90, "minute")
      .format("HH:mm");
  } else if (opt.value === "edit") {
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
        const currentDesc = result.DESC;
        if (currentDesc !== null && currentDesc !== "") {
          desc.value = currentDesc;
        }
        members.value = result.members;
        instanceId.value = result.instanceId;
      },
      err: (err) => {},
    });
  }
});
</script>

<style lang="less" scoped>
@import url("./meeting.less");
</style>
