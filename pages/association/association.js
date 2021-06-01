// pages/association.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 70 + "px",
    userAvatar: "/images/logo.png",
    userInfo: {},
    simpleInfo: {},
    degree: void 0,
    experience: void 0,
    industry: void 0,
    links: {
      suggestList: [],
      suggested: 0,
      currentSuggestCount: 0,
      successTimes: 0,
      realSuccessTimes: 0,
      todayRecognizedList: [],
      todaySuggestList: [],
    },
    filterType: 0,
    userId: "",
    circleType: "",
    circleValue: "",
    businessId: "",
    defaultAvatar: "/images/v2_qn75yc.jpg",
    showUserCardDialog: false,
    choiceUser: {},
    suggest: {
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      suggestList: []
    },
    status: "loadmore",
    timestamp: "",
    showTagPopup: false,
    tagList: [],
    showFloatingButton: false,
    isPhoneLogin: false,
    mobile: "",
    code: "",
    codeText: "获取验证码",
    showTipsDialog: false,
    showWechatLodin: true,
    showWechatLoginDialog: false
  },
  setBaseInfo: function() {

  },
  setTimeSeed: function() {

  },
  getTimeSeed: function() {

  },
  getDegree: function() {

  },
  getExperience: function() {

  },
  getIndustry: function() {

  },
  getSimpleInfo: function() {

  },
  toFriend: function() {

  },
  toUserInfo: function(res) {

  },
  onClickDropDown: function(res) {

  },
  toMessage: function() {

  },
  loadData: function() {

  },
  loadNextPage: function() {

  },
  ke: function(res) {

  },
  ked: function() {

  },
  refresh: function() {

  },
  toPersonal: function() {

  },
  getTag: function() {

  },
  toCircle: function() {

  },
  codeChange: function(res) {

  },
  getCode: function() {

  },
  phoneLogin: function() {

  },
  isLogin: function() {

  },
  click_isLogin: function() {

  },
  click_showTagPopup: function() {

  },
  getPhoneNumber: function(res) {

  },
  getWeChatUserInfo: function(res) {

  },
  getEducationalListInfo: function(res) {

  },
  initLogin: function(res) {

  },
  getMessageNumber: function() {

  }
})