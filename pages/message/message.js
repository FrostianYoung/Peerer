// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 70 + 'px',
    defaultAvatar: "/images/v2_qn75yc.jpg",
    type_3Image: "/images/type_3Image.jpg",
    status: "loadmore",
    messages: {
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      data: []
    },
    notification_1: {
      data: [],
      unReadCount: 0
    },
    notification_2: {
      data: [],
      unReadCount: 0
    },
    userInfo: {},
    userId: "",
    degree: void 0,
    experience: void 0,
    industry: void 0,
   toDetailUserId: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getDegree: function() {
    var this_ = this;
    wx.getStorage({
      key: "degree",
      success: function(e) {
        this_.degree = e.data;
      }
    });
  },
  getExperience: function() {
    var this_ = this;
    wx.getStorage({
      key: "experience",
      success: function(e) {
        this_.experience = e.data;
      }
    });
  },
  getIndustry: function() {
    var this_ = this;
    wx.getStorage({
      key: "industry",
      success: function(e) {
        this_.industry = e.data;
      }
    });
  },
  toNewWork: function(){
    wx.switchTab({
      url: '/pages/find/find',
      fail (err) {
        console.log(err);
      }
    });
  },
  loadThreads: function() {
    var this_ = this;
    this.status = "loading",
    wx.getStorage({
      key: "token",
      success (res) {

      },
      fail (err) {

      }
    });
  },
  loadNotification: function() {

  },
  getUserInfo: function() {
    var this_ = this;
    wx.getStorage({
      key: "userInfo",
      success: function(e) {
        this_.userInfo = e.data,
        this_.userId = wx.data.id;
      }
    });
  },
  substring: function(e, t, n) {
    return e? e.toString().substring(t,n):"";
  },
  formartterDegree: function(res) {
  },
  formartterDate: function(res) {
    
  },
  messageTag: function(res) {

  },
  loadNextPage: function() {
    Number(this.page.totalCount) > this.page.data.length && (this.page.pageNo++, this.loadThreads());
  },
  friendZoneNewReply: function(res) {

  },
  toMessageDetail: function(res) {
    wx.setStorage({
      key: "messageDetail",
      data: res,
      success () {
        wx.navigateTo({
          url: '/components/component/messageDetial',
          fail (err) {
            console.log(err);
          }
        });
      }
    });
  },
  refresh: function() {
    this.messages = {
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      data: []
    },
    this.notification_1 = {
      data: [],
      unReadCount: 0
    },
    this.notification_1 = {
      data: [],
      unReadCount: 0
    }
  },
  calcIdentical: function(res){
    function t(e, t, n, a){

    }
    var this_ = this;
    if(1) {
      return false;
    }
    if(1) {
      return false;
    }
    if(1) {
      return false;
    }
    if(1) {
      return false;
    }
    if(1) {
      return false;
    }
  },
  formartterIndustry: function(res){

  },
  formartterExperience: function(res) {

  },
  getMessageNumber: function() {
    
  }
})