// pages/login/login.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //是否显示登录弹窗
    currentTime: 3,
    canGetCode: true, //获取验证码按钮是否可用
    isPhoneLogin: false, //因为使用了简易双向绑定，不支持路径
    mobile: "",
    code: "",
    codeText: "获取验证码"
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
  getMobileInput: function (e) { // 获取手机号的输入
    var this_ = this;
    var mobileInput = e.detail;
    this_.setData({
      mobile: mobileInput
    })
    //console.log(this_.data.mobile);
  },
  openPhoneLogin: function () { // 手机号登录
    this.data.isPhoneLogin = true;
  },
  getCode(){ // 获取验证码
    var this_ = this;
    var phone = this_.data.mobile;
    console.log(this_.data.mobile);
    var myreg =  /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if(phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return false;
    } else if(phone.length != 11 ){
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return false;
    } else if(!myreg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return false;
    } else if(!this_.data.canGetCode) {
      wx.showToast({ // 不能获取Code
        title: '倒计时结束后再发送',
        icon: 'none'
      })
      return false;
    } else {
      wx.showLoading({
        title: '正在获取验证码',
        icon: 'none'
      }),
      wx.request({
        url: 'https://peerer.cn/api/v1/uc/member/verifycode',
        method: 'POST',
        data: {
          module: "login",
          type: "sms",
          key: this.data.mobile
        },
        success (res) {
          if(res.data.status) {
            wx.hideLoading()
          } else {
            wx.hideLoading(),
            console.log(res.data.errMsg),
            wx.showToast({
              title: '获取验证码错误',
              icon: 'none'
            })
          }
        },
        fail (err) {
          wx.hideLoading(), 
          console.log(err), 
          wx.showToast({
            title: '获取验证码错误',
            icon: 'none'
          })
        }
      })
      this_.setData({canGetCode: true})
      var currentTime = this_.data.currentTime;
      var interval = setInterval(function() {
        currentTime--;
        this_.setData({
          codeText: currentTime + '秒'
        })
        if(currentTime <= 0) {
          clearInterval(interval);
          this_.setData({
            currentTime: 3,
            canGetCode: false,
            codeText: '重新获取'
          })
        }
      }, 1000)
    }
  },  
  phoneLogin: function() { //根据手机号登录
    var this_ = this;
    if(this_.data.mobile == '' || this_.data.code == '') {
      wx.showToast({
        title: '请输入手机号与验证码',
        icon: 'none'
      })
    } else {
      wx.request({
        url: 'https://peerer.cn/api/v1/uc/member/login',
        method: 'POST',
        data: {
          loginType: "0",
          userName: this.data.mobile,
          code: this.data.code
        },
        success (res) {
          if(res.data.status) {
            wx.showToast({
              title: '登陆成功',
              icon: 'none'
            })
            var token = {};
            token.accessToken = res.data.result.accessToken,
            token.refreshToken = res.data.refreshToken,
            wx.setStorage({
              key: "token",
              data: token,
              success () {
                wx.switchTab({
                  url: '/pages/mine/mine',
                  success () {
                    console.log('success');
                  },
                  fail (err) {
                    console.log(err);
                  }
                })
              }
            })
          } else {
            wx.hideLoading(),
            console.log(res.data.error),
            wx.showToast({
              title: '登录失败，请重试'+res.data.error.errorMessage,
              icon: 'none'
            })
          }
        },
        fail (err) {
          wx.hideLoading(), 
          console.log(err), 
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none',
          });
        }
      });
    }
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
  onChange(e) { // ?
    this.setData({
      [e.currentTarget.dataset.value]: e.detail
    })
  }
  /*
  mobileInput(e) {// 获取输入值
    this.setData({
      mobile : e.detail
    })
  },
  vfCodeInput(e) {
    this.setData({
      code : e.detail
    })
  }*/
})
/*
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
        }
      },
      */