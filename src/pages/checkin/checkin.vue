<template>
  <view>
    <camera
      device-position="front"
      flash="off"
      class="camera"
      @error="error"
      v-if="showCamera"
    />
    <image mode="widthFix" class="image" :src="photoPath" v-if="showImage" />
    <view class="operate-container">
      <button
        type="primary"
        class="btn"
        @tap="clickBtn"
        :disabled="!canCheckin"
      >
        {{ btnText }}
      </button>
      <button type="warn" class="btn" @tap="afresh" :disabled="!canCheckin">
        重拍
      </button>
    </view>
    <view class="notice-container">
      <text class="notice">注意事项</text>
      <text class="desc">
        拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外，拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度。
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { NetWork } from "@/service";
import { checkin, validCanCheckIn } from "@/config";
const QQMapWX = require("../../static/qqmap-wx-jssdk.min.js");

const TencentMapSDK = ref();
const canCheckin = ref(true);
const showCamera = ref(true);
const showImage = ref(false);
const photoPath = ref("");
const btnText = ref("拍照");

// 经纬度
const longitude = ref(0);
const latitude = ref(0);

// 地址
const address = ref("");
// 详细信息
const addressComponent = ref({});
// 国家
const nation = ref("");
// 省份
const province = ref("");
// 城市
const city = ref("");
// 地区
const district = ref("");

onLoad(() => {
  TencentMapSDK.value = new QQMapWX({
    key: "3RYBZ-FQ36J-RQMFA-KPSVU-VDFS2-Q4F67",
  });
});
onShow(() => {
  NetWork({
    url: validCanCheckIn,
    method: "GET",
    data: null,
    fun: (res) => {
      const msg = res.data.msg;
      if (msg !== "可以考勤") {
        canCheckin.value = false;
        setTimeout(() => {
          uni.showToast({
            title: msg,
            icon: "none",
          });
        }, 1000);
      }
    },
  });
});

const clickBtn = () => {
  if (btnText.value === "拍照") {
    const ctx = uni.createCameraContext();
    ctx.takePhoto({
      quality: "high",
      success: (response) => {
        photoPath.value = response.tempImagePath;
        showCamera.value = false;
        showImage.value = true;
        btnText.value = "签到";
      },
    });
  } else {
    uni.showLoading({
      title: "签到中请稍后",
    });

    setTimeout(function() {
      uni.hideLoading();
    }, 10000);

    uni.getLocation({
      success: (res) => {
        longitude.value = res.longitude;
        latitude.value = res.latitude;

        TencentMapSDK.value.reverseGeocoder({
          location: {
            latitude: latitude.value,
            longitude: longitude.value,
          },
          success: (res) => {
            address.value = res.result.address;
            addressComponent.value = res.result.address_component;
            nation.value = addressComponent.value.nation;
            province.value = addressComponent.value.province;
            city.value = addressComponent.value.city;
            district.value = addressComponent.value.district;
            const form = {
              address: address.value,
              city: city.value,
              country: nation.value,
              province: province.value,
              district: district.value,
            };
            NetWork({
              url: checkin,
              method: "POST",
              data: form,
              fun: (res) => {
                uni.showToast({
                  title: res.data.msg,
                  complete: () => {
                    uni.navigateTo({
                      url: "../checkin-result/checkin-result",
                    });
                  },
                });
              },
              err: (err) => {
                uni.showToast({
                  title: err.data.msg,
                  icon: "none",
                });
              },
            });
          },
        });
      },
    });
  }
};

const afresh = () => {
  showCamera.value = true;
  showImage.value = false;
  btnText.value = "拍照";
};
</script>

<style lang="less" scoped>
@import url("./checkin.less");
</style>
