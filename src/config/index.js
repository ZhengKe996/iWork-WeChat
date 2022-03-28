export const BASE_URL = "http://127.0.0.1:9000/emos-wx-api";

// 签到
export const validCanCheckIn = `${BASE_URL}/checkin/validCanCheckIn`;
export const checkin = `${BASE_URL}/checkin/checkin`;
export const searchTodayCheckin = `${BASE_URL}/checkin/searchTodayCheckin`;
export const searchMonthCheckin = `${BASE_URL}/checkin/searchMonthCheckin`;

// 用户操作
export const register = `${BASE_URL}/user/register`;
export const login = `${BASE_URL}/user/login`;
export const searchUserSummary = `${BASE_URL}/user/searchUserSummary`;
export const searchUserGroupByDept = `${BASE_URL}/user/searchUserGroupByDept`;
export const searchMembers = `${BASE_URL}/user/searchMembers`;

// 系统消息
export const refreshMessage = `${BASE_URL}/message/refreshMessage`;
export const searchMessageByPage = `${BASE_URL}/message/searchMessageByPage`;
export const searchMessageById = `${BASE_URL}/message/searchMessageById`;
export const updateUnreadMessage = `${BASE_URL}/message/updateUnreadMessage`;
export const deleteMessageRefById = `${BASE_URL}/message/deleteMessageRefById`;

// 会议
export const searchMyMeetingListByPage = `${BASE_URL}/meeting/searchMyMeetingListByPage`;
export const insertMeeting = `${BASE_URL}/meeting/insertMeeting`;
export const updateMeetingInfo = `${BASE_URL}/meeting/updateMeetingInfo`;
export const searchMeetingById = `${BASE_URL}/meeting/searchMeetingById`;
export const deleteMeetingById = `${BASE_URL}/meeting/deleteMeetingById`;
export const searchExamineMeetingList = `${BASE_URL}/meeting/searchExamineMeetingList`;
export const searchUserMeetingInMonth = `${BASE_URL}/meeting/searchUserMeetingInMonth`;

// 审批
export const updateExamineMeeting = `${BASE_URL}/meeting/updateExamineMeeting`;

export const test = `${BASE_URL}/test/sayHello`;
