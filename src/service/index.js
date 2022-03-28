export const NetWork = ({ url, method, data, fun, err }) => {
  uni.request({
    url: url,
    method: method,
    header: {
      token: uni.getStorageSync("token"),
    },
    data: data,
    success: (response) => {
      if (response.statusCode == 401) {
        uni.redirectTo({
          url: "/pages/login/login",
        });
      } else if (response.statusCode == 200 && response.data.code == 200) {
        const data = response.data;
        if (data.hasOwnProperty("token")) {
          const token = data.token;
          uni.setStorageSync("token", token);
        }
        fun(response);
      } else if (response.statusCode == 500) {
        err(response);
      } else {
        uni.showToast({
          icon: "none",
          title: response.data.msg,
        });
      }
    },
  });
};
