// pages/mine/mine.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 70 + 'px',
    defaultAvatar: "/static/images/defaultAvatar.jpg",
    userId: "",
    userInfo: {},
    currentTab: 0,
    tabList: [{
      name: "名片"
    }, {
      name: "动态",
      count: 0
    }],
    degree: void 0,
    experience: void 0,
    industry: void 0,
    showImage: false,
    showLogin: false,
    isEditing: false,
    isLogin: false,
    isPhoneLogin: false,
    mobile: "",
    code: "",
    codeText: "获取验证码",
    currentTime: 3,
    canGetCode: true, //获取验证码按钮是否可用
  },
  getDegree: function () {
    var this_ = this;
    wx.getStorage({
      key: "degree",
      success: function (res) {
        this_.data.degree = res.data;
      }
    });
  },
  getExperience: function () {
    var this_ = this;
    wx.getStorage({
      key: "experience",
      success: function (res) {
        this_.data.experience = res.data;
      }
    });
  },
  getIndustry: function () {
    var this_ = this;
    wx.getStorage({
      key: "industry",
      success: function (res) {
        this_.data.industry = res.data;
      }
    });
  },
  formartterEduInfo: function (e) {
    return (e.school.name ? e.shcool.name : "") + " · " + (e.specialism.name ? e.specialism.name : "") +
      " · " + (e.grade ? e.grade : "") + " " + (e.degree ? this.formartterDegree(e.degree) : "");
  },
  baseFormartterEduInfo: function (e) {
    return "from " + (e.school.abbreviation ? e.school.abbreviation : "") + " " + (e.specialism.name ? e.specialism.name : "");
  },
  formartterDegree: function (e) {
    if (this.degree) return this.degree.find(function (t) {
      return t.dictValue == e;
    }).dictShowName;
  },
  formartterIndustry: function (e) {
    if (this.industry) return this.industry.find(function (t) {
      return t.dictValue == e;
    }).dictShowName;
  },
  formarrterExperience: function (e) {
    if (this.experience) return this.experience.find(function (t) {
      return t.dictValue == e;
    }).dictShowName;
  },
  toCircle: function (type, name, id, icon) {
    this.data.topicType = type,
      this.data.topiName = name,
      this.data.topicId = id,
      this.data.topicIcon = icon || "",
      wx.navigateTo({
        url: "/components/component/friendZoneCircle?topicId=" + this.data.topicId + "&topicType=" +
          this.data.topicType + "&topicIcon=" + this.data.topicIcon + "&topicName=" + this.topicName,
        fail: function (err) {
          console.log(err);
        }
      });
  },
  loadData: function () {
    var this_ = this;
    wx.showLoading({
        title: '加载中...',
      }),
      wx.getStorage({
        key: "token",
        success: function (res) {
          if (res.data.accessToken) {
            wx.getStorage({
              key: "userInfo",
              success: function (userInfo) {
                this_.data.userId = userInfo.data.id,
                  wx.request({
                    url: 'https://peerer.cn/api/v1/uc/member/' + this_.data.userId,
                    method: "GET",
                    header: {
                      Authorization: res.data.accessToken
                    },
                    success: function (res1) {
                      if (res1.data.status) {
                        this_.userInfo = res1.data.result;
                        if (this_.userInfo.avatar && this_.userInfo.nickName && this_.userInfo.sex) {
                          if (this_.userInfo.educationList) {} else {
                            wx.showToast({
                              title: '请完善教育信息',
                            })
                            wx.navigateTo({
                              url: '/components/component/home/eduInfoEdit?eduId=&eduLength=0',
                              fail(err) {
                                console.log(err);
                              }
                            })
                          }
                        } else {
                          wx.showToast({
                            title: '请完善基本信息',
                          })
                          this_.settingBaseInfo();
                        }
                      } else {
                        console.log(res1.data.error);
                        wx.hideLoading(),
                          wx.stopPullDownRefresh();
                      }
                    },
                    fail(err) {
                      wx.hideLoading(),
                        wx.stopPullDownRefresh(),
                        console.log(err);
                    }
                  }),
                  wx.request({
                    url: 'https://peerer.cn/api/v1/bbs/post/discover',
                    method: "GET",
                    header: {
                      Authorization: res.data.accessToken
                    },
                    data: {
                      pageNo: 1,
                      pageSize: 10,
                      memberId: this_.data.userId ? this_.data.userId : null
                    },
                    success(res) {
                      if (res.data.status) {
                        this_.tabList[1].count = Number(res.data.result.totalCount);
                      } else {
                        console.log(res.data.error);
                      }
                    },
                    fail(err) {
                      console.log(err);
                    }
                  });
              }
            })
          } else {
            wx.clearStorage();
          }
        },
        fail(err) {
          console.log(err),
            wx.clearStorage(),
            wx.hideLoading(),
            wx.stopPullDownRefresh();
        }
      });
  },
  tabChange: function (e) {
    this.setData({
      currentTab: e.detail.index
    })
  },
  hasTag: function (tag) {
    if (!this.userInfo.tagsList) return false;
    for (var i = 0; i < this.userInfo.tagsList.length; i++) {
      if (this.userInfo.tagsList[i].tag.category == tag) {
        return true;
      }
    }
    return false;
  },
  toMessageDetail: function () {
    wx.navigateTo({
      url: '/components/component/messageDetail?userId=' + this.data.userId,
      fail: function (err) {
        console.log(err);
      }
    });
  },
  showSecondDegreeRecognized: function () {
    wx.navigateTo({
      url: '/components/component/friend?type=4&memberId=' + this.data.userId,
      fail: function (err) {
        console.log(err);
      }
    });
  },
  FriendZonetalCount: function (cnt) {
    this.data.tabList[1].count = cnt;
  },
  settingBaseInfo: function () {
    wx.navigateTo({
      url: '/components/component/home/settingBaseInfo',
      fail: function (err) {
        console.log(err);
      }
    });
  },
  editUserInfo: function () {
    this.data.isEditing = true;
  },
  /*
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: function(res) {
        res.confirm ? 
          (wx.clearStorage(),
          wx.switchTab({
            url: '/pages/association/association',
            success: function() {
              var page = getCurrentPages().pop();
              void 0 != page && null != page && page.onLoad();
            },
            fail: function(err) {
              console.log(err);
            }
          })) :
            res.cancel && console.log("用户点击取消");
      },
      fail: function(err) {
        console.log(err);
      }
    });
  },
  */
  savingUserInfo: function () {
    this.isEditing = false,
      this.loadData();
  },
  publish: function () {
    wx.navigateTo({
      url: '/components/component/publishFriendZone',
      fail: function (err) {
        console.log(err);
      }
    });
  },
  getMessageNumber: function () {
    wx.getStorage({
      key: "token",
      success: function (res) {
        if (res.data.accessToken) {
          wx.request({
            url: 'https://peerer.cn/api/v1/uc/messageThread/latest',
            method: "GET",
            header: {
              Authorization: res.data.accessToken
            },
            success: function (t) {
              if (t.data.status) {
                if (t.data.result >= 1) {
                  wx.setTabBarBadge({
                    index: 2,
                    text: t.data.result.toString(),
                  })
                } else {
                  wx.removeTabBarBadge({
                    index: 2,
                  })
                }
              } else {
                console.log(t.data.error),
                  wx.removeTabBarBadge({
                    index: 2,
                  })
              }
            },
            fail: function (err) {
              console.log(err),
                wx.removeTabBarBadge({
                  index: 2,
                });
            }
          })
        } else {
          wx.clearStorage();
        }
      },
      fail: function (err) {
        console.log(err),
          wx.removeTabBarBadge({
            index: 2,
          });
      }
    });
  },
  click_isLogin: function () {
    var this_ = this;
    wx.getStorage({
      key: "token",
      success: function (res) {
        if (res.data.accessToken) {
          if (this_.data.isLogin) {
            wx.clearStorage();
            if (!this_.data.isPhoneLogin) {
              wx.login({
                provider: "weixin",
                success(res) {
                  wx.setStorage({
                    key: "loginResCode",
                    data: res.code,
                    success() {
                      this_.isLogin = false;
                    },
                    fail(err) {
                      console.log(err);
                    }
                  })
                },
                fail(err) {
                  console.log(err);
                  this_.data.isLogin = false;
                }
              })
            } else {
              this_.phoneLogin();
            }
          }
        }
      },
      fail(res) {
        wx.clearStorage();
        if (this_.data.isPhoneLogin) {
          if (this_.data.isLogin) {
            wx.login({
              provider: "weixin",
              success(res) {
                wx.setStorage({
                  key: "loginResCode",
                  data: res.code,
                  success() {
                    this_.isLogin = false;
                  },
                  fail(err) {
                    console.log(err);
                  }
                })
              },
              fail(err) {
                console.log(err);
                this_.data.isLogin = false;
              }
            })
          }
        }
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
  getCodeInput: function (e) {
    var this_ = this;
    var codeInput = e.detail;
    this_.setData({
      code: codeInput
    })
    console.log(this_.data.code);
  },
  openPhoneLogin: function () { // 手机号登录
    this.data.isPhoneLogin = true;
  },
  getCode() { // 获取验证码
    var this_ = this;
    var phone = this_.data.mobile;
    console.log(this_.data.mobile);
    var myreg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return false;
    } else if (phone.length != 11) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return false;
    } else if (!myreg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return false;
    } else if (!this_.data.canGetCode) {
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
          success(res) {
            if (res.data.status) {
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
          fail(err) {
            wx.hideLoading(),
              console.log(err),
              wx.showToast({
                title: '获取验证码错误',
                icon: 'none'
              })
          }
        })
      this_.setData({
        canGetCode: true
      })
      var currentTime = this_.data.currentTime;
      var interval = setInterval(function () {
        currentTime--;
        this_.setData({
          codeText: currentTime + '秒'
        })
        if (currentTime <= 0) {
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
  phoneLogin: function () { //根据手机号登录
    var this_ = this;
    if (this_.data.mobile == '' || this_.data.code == '') {
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
        success(res) {
          if (res.data.status) {
            wx.showToast({
              title: '登陆成功',
              icon: 'none'
            });
            this_.initLogin(res);
            this_.closeLoginPopUp();
          } else {
            wx.hideLoading(),
              console.log(res.data.error),
              wx.showToast({
                title: '登录失败，请重试' + res.data.error.errorMessage,
                icon: 'none'
              })
          }
        },
        fail(err) {
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
    var this_ = this;
    if (res.detail.iv) {
      wx.getStorage({
        key: "loginResCode",
        success(res1) {
          if (res1.data) {
            var i = {
              encryptedData: res.detail.encryptedData,
              iv: res.detail.iv,
              code: res1.data
            };
            wx.request({
              url: 'https://peerer.cn/api/v1/minapp/user/phone',
              method: 'POST',
              data: i,
              success(res2) {
                if (res2.data.status) {
                  this_.initLogin(res2);
                } else {
                  console.log(res2.data.error);
                  this_.data.isPhoneLogin = true;
                }
              },
              fail(err) {
                console.log(err),
                  this_.isPhoneLogin = true;
              }
            })
          } else {
            this_.isPhoneLogin = true;
          }
        }
      })
    } else {
      this_.data.isPhoneLogin = true;
    }
  },
  showLoginPopUp() { // 展示login弹窗
    this.setData({
      showLogin: true
    })
  },
  closeLoginPopUp() { // 关闭login弹窗
    this.setData({
      showLogin: false
    })
  },
  showImagePopUp() { // 展示login弹窗
    this.setData({
      showImage: true
    })
  },
  closeImagePopUp() { // 关闭login弹窗
    this.setData({
      showImage: false
    })
  },
  initLogin: function (res) {
    var this_ = this;
    var token = {};
    var accessToken = "";
    if (res.data.result.token) {
      token = res.data.result.token;
      accessToken = res.data.result.token.accessToken;
    } else {
      token.accessToken = res.data.result.accessToken;
      token.refreshToken = res.data.result.refreshToken;
      accessToken = res.data.result.accessToken;
    }
    wx.setStorage({
      key: "token",
      data: token,
      success: function () {
        wx.request({
          url: 'https://peerer.cn/api/v1/uc/member/fullUserInfo',
          method: 'GET',
          header: {
            Authorization: accessToken
          },
          success (res1) {
            if(res1.data.status){
              wx.setStorage({
                key: "fullUserInfo",
                data: res1.data,
                fail (err) {
                  console.log(err);
                }
              });
              console.log(res1.data);
            } else {
              console.log(res1.data.error);
            }
          },
          fail (err) {
            console.log(err);
          }
        })
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  refresh: function () {
    this.phoneLogin(),
      this.loadData(),
      this.getMessageNumber();
  }
})