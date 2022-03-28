const checkPermission = (perms) => {
  const permission = uni.getStorageSync("permission");
  let result = false;
  for (const one of perms) {
    if (permission.indexOf(one) != -1) {
      result = true;
      break;
    }
  }
  return result;
};

const checkNull = (data, name) => {
  if (data == null) {
    uni.showToast({
      icon: "none",
      title: name + "不能为空",
    });
    return true;
  }
  return false;
};

const checkBlank = (data, name) => {
  if (data == null || data == "") {
    uni.showToast({
      icon: "none",
      title: name + "不能为空",
    });
    return true;
  }
  return false;
};
const checkValidName = (data, name) => {
  if (data == null || data == "") {
    uni.showToast({
      icon: "none",
      title: name + "不能为空",
    });
    return true;
  } else if (!/^[\u4e00-\u9fa5]{2,15}$/.test(data)) {
    uni.showToast({
      icon: "none",
      title: name + "内容不正确",
    });
    return true;
  }
  return false;
};
const checkValidTel = (data, name) => {
  if (data == null || data == "") {
    uni.showToast({
      icon: "none",
      title: name + "不能为空",
    });
    return true;
  } else if (!/^1[0-9]{10}$/.test(data)) {
    uni.showToast({
      icon: "none",
      title: name + "内容不正确",
    });
    return true;
  }
  return false;
};
const checkValidEmail = (data, name) => {
  if (data == null || data == "") {
    uni.showToast({
      icon: "none",
      title: name + "不能为空",
    });
    return true;
  } else if (
    !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(data)
  ) {
    uni.showToast({
      icon: "none",
      title: name + "内容不正确",
    });
    return true;
  }
  return false;
};
const checkValidStartAndEnd = (start, end) => {
  const d1 = new Date("2000/01/01 " + start + ":00");
  const d2 = new Date("2000/01/01 " + end + ":00");
  if (d2.getTime() <= d1.getTime()) {
    uni.showToast({
      icon: "none",
      title: "结束时间必须大于开始时间",
    });
    return true;
  }
  return false;
};

export {
  checkPermission,
  checkNull,
  checkBlank,
  checkValidName,
  checkValidTel,
  checkValidEmail,
  checkValidStartAndEnd,
};
