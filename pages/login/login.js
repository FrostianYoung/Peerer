// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  loadPages: function(param){
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  }
})