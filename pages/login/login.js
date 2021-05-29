// pages/login/login.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //是否显示登录弹窗
    currentTime: 30,
    sending: false, //获取验证码按钮是否可用
    loginForm: {
      isPhoneLogin: false,
      mobile: "",
      code: "",
      codeText: "获取验证码"
    },
  },
  onLoad: function (options) { //页面加载后就从本地获取登录信息
    this.getLoginStateFromStorage();
  },
  getLoginStateFromStorage: function () { //从本地获取登录信息
    wx.getStorage({
      key: "token", // token关键字，存储登录信息
      success: function(storageData) {
        storageData.data.result.accessToken ? 
          wx.switchTab({
            url: '/pages/association/association',
            success: function() {
              var firstPage = getCurrentPages().pop(); // 获取当前页面栈的第一个页面
              void 0 != firstPage && null != firstPage && firstPage.onLoad(); // 页面是否成功打开
            },
            fail: function(err) {
              console.log(err);
            }
        }) : wx.clearStorage({ // 本地没有accessToken，清除登录信息
          success: (res) => {},
        })
      }
    })
  },
  openPhoneLogin: function () { // 手机号登录
    this.isPhoneLogin = true;
  },
  codeChange: function (codeText) { // 修改验证码按钮对应内容，用来显示倒计时和重新发送验证码
    this.codeText = codeText;
  },
  getCode(){ // 获取验证码
    let _this = this;
    this.mobile ? 
      /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(this.mobile) ? // 测试手机号格式
      this.selectComponent('#canGetCode') ? // 组件，判断是否可以获取验证码（根据倒计时）
        (wx.showLoading({ // 可以获取验证码
        title: "正在获取验证码",
        icon: 'none'
      }), wx.request({ // 从后端获取验证码
        url: 'https://peerer.cn/api/v1/uc/member/verifycode',
        method: "POST",
        data: {
          module: "login",
          type: "sms",
          key: this.mobile
        },
        success: function(res) { // 获取成功，显示等待信息
          res.data.status ? setTimeout(function() { //设置定时器
            wx.hideLoading(), 
            wx.selectComponent('#codeCountStart');
          }, 1000) 
          : (wx.hideLoading(), 
            console.log(res.data.errMsg), 
            wx.showToast({
              title: '获取验证码错误',
              icon: 'none'
            }))
        },
        fail: function(err) {
          wx.hideLoading(), 
          console.log(err), 
          wx.showToast({
            title: '获取验证码错误',
            icon: 'none'
          })
        }
    })) : wx.showToast({ // 不能获取Code
      title: '倒计时结束后再发送',
      icon: 'none'
    }) : wx.showToast({ 
      title: '"手机号格式不正确"',
      icon: 'none'
    }) : wx.showToast({ // this.mobile为空 
        title: '请输入手机号',
        icon: 'none'
      })
  },
  phoneLogin: function() { //根据手机号登录
    var this_ = this;
    this.mobile && this.code ? // 手机号和验证码非空
    wx.request({ // 后端登录
      url: 'https://peerer.cn/api/v1/uc/member/login',
      method: "POST",
      data: {
        loginType: "0",
        userName: this.mobile,
        code: this.code
      },
      success: function(res) { // res中是服务器返回的内容，没有找到这个API，格式暂不明
        if(res.data.status) {
          wx.showToast({
            title: '登陆成功',
            icon: 'none',
          })
          var token = {};
          token.accessToken = res.data.result.accessToken,
          token.refreshToken = res.data.refreshToken,
          wx.setStorage({ // 存储用户信息到本地
            key: "token",
            data: token,
            success: function() {
              wx.switchTab({ // 切换界面
                url: '/pages/find/find',
                success: function() { //以下内容暂未修改完成
                  var t = r(s.default.mark(function t(o) {
                    return s.default.wrap(function (t) {
                      for(;;)
                        switch(t.prev = t.next) {
                          case 0:
                            return t.next = 2, 
                            wx.request({
                              url: 'https://peerer.cn/api/v1/base/dict/degree/values',
                              method: "GET",
                              header: {
                                Authorization: n.data.result.accessToken
                              },
                              success: function(res) {
                                res.data.status ? wx.setStorage({
                                  key: "degree",
                                  data: res.data.result,
                                  fail: function(err){
                                    console.log(err);
                                  }
                                }) : console.log(t.data.error);
                              },
                              fail: function(err){
                                console.log(err);
                              }
                            });
                          case 2:
                            return t.next = 4, 
                            wx.request({
                              url: 'https://peerer.cn/api/v1/base/dict/experience/values',
                              method: "GET",
                              header: {
                                Authorization: n.dta.result.accessToken
                              },
                              success: function(t) {
                                t.data.status ? wx.setStorage({
                                  key: "experience",
                                  data: t.data.result,
                                  fail: function(err) {
                                    console.log(err);
                                  }
                                }) : console.log(t.data.error);
                              },
                              fail: function(err) {
                                console.log(err);
                              }
                            });
                          case 4:
                            return t.next = 6, 
                            wx.request({
                              url: 'url',
                            })
                          case 6:
                          case 8:
                          case "end":
                            return t.stop();
                        }
                    }, t);
                  }));
                  return function(e) {
                    return t.apply(this, arguments);
                  };
                },
                fail: function(err) {
                  console.log(err);
                }
              });
            }
          })
        } else { // status = false, 登陆失败
          wx.hideLoading(), 
          console.log(res.data.error), 
          wx.showToast({
            title: '登录失败，请重试' + res.data.error.errorMessage,
            icon: 'none',
          })
        }
      },
      fail: function(err) {
        wx.hideLoading(), 
        console.log(err), 
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none',
        })
      }
    }) : wx.showToast({ // 手机号与验证码有空的
          title: '请输入手机号与验证码',
          icon: 'none',
        })
  },
  getPhoneNumber: function (res) { // 获取微信绑定手机号
    console.log(res),
    wx.login({
      provider: "weixin",
      success: function(t) {
        console.log("登录", t.code), wx.getUserInfo({
          provider: "weixin",
          success: function(e) {
            console.log(e);
          }
        });
      }
    });
  },
  showLogin() { // 展示login弹窗
    this.setData({
      show: true
    })
  },
  onClose() { // 关闭login弹窗
    this.setData({
      show: false
    })
  },
  getInputKey(e) {// 获取输入值
    let key = e.currentTarge.dataset.name;
    let value = e.detail.value;
    this.setData({
      [key]: value
    })
  },
})