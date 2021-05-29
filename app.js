// app.js
const app=getApp()

App({
  onLaunch() {
    var this_=this
    // 登录
    wx.login({
      success: function (res) {
        if(res.code){
          console.log(res.code);
          wx.request({
            url: this_.globalData.url+'/v1/minapp/user/code2session',
            data: {
              'code': res.code
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              //console.log(res)
              if (res.status == 1) {
                wx.setStorage('phone', res.phone);
              }
            },
          })
        } else {
          console.log('获取用户登录态失败' + res.errMsg);
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  globalData: {
    userInfo: null,
    url:'https://peerer.cn/api'
  }
})
