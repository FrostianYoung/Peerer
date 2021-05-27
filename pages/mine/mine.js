// pages/mine/mine.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    tabList: ['名片', '动态'],
    scrollleft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  checkAvatar: function(param){ // todo
    wx.switchTab({
      url: '/pages/association/association',
    })
  }
})