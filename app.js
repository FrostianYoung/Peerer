// app.js
const app=getApp()

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var this_=this
    // 登录
    wx.login({
      success: function (res) {
        if(res.code){
          console.log(res.code);
          wx.request({
            url: this_.globalData.url+'/v1/minapp/user/code2session',
            data: {
              code: res.code
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res)
            }
          })
        } else {
          console.log('获取用户登录态失败' + res.errMsg);
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    url:'https://peerer.cn/api'
  }
})
