// pages/mine/mine.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight : wx.getSystemInfoSync().statusBarHeight + 70 + 'px',
    defaultAvatar: "/images/v2_qn75yc.jpg",
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
    showPopUpImage: false,
    isEditing: false,
    isLogin: false,
    isPhoneLogin: false,
    mobile: "",
    code: "",
    codeText: "获取验证码"
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
  },

  getDegree: function() {
    var this_ = this;
    wx.getStorage({
      key: "degree",
      success: function(res) {
        this_.degree = res.data;
      }
    });
  },
  getExperience: function() {
    var this_ = this;
    wx.getStorage({
      key: "experience",
      success: function(res) {
        this_.experience = res.data;
      }
    });
  },
  getIndustry: function() {
    var this_ = this;
    wx.getStorage({
      key: "industry",
      success: function(res) {
        this_.industry = res.data;
      }
    });
  },
  formartterEduInfo: function(e) {
    return (e.school.name ? e.shcool.name : "") + " · " + (e.specialism.name ? e.specialism.name : "")
    + " · " + (e.grade ? e.grade : "") + " " + (e.degree ? this.formartterDegree(e.degree) : "");
  },
  baseFormartterEduInfo: function(e) {
    return "from "+ (e.school.abbreviation ? e.school.abbreviation : "") + " " + (e.specialism.name ? e.specialism.name : "");
  },
  formartterDegree: function(e) {
    if(this.degree) return this.degree.find(function(t) {
      return t.dictValue == e;
    }).dictShowName;
  },
  formartterIndustry: function(e) {
    if(this.industry) return this.industry.find(function(t) {
      return t.dictValue == e;
    }).dictShowName;
  },
  formarrterExperience: function(e) {
    if(this.experience) return this.experience.find(function(t) {
      return t.dictValue == e;
    }).dictShowName;
  },
  toCircle: function(t, n, o, i) {
    this.topicType = t,
    this.topiName = n,
    this.topicId = o,
    this.topicIcon = i || "",
    wx.navigateTo({
      url: "/components/component/friendZoneCircle?topicId=" + this.topicId +"&topicType= " +
      this.topicType + "&topicIcon=" + this.topicIcon + "&topicName=" + this.topicName,
      fail: function(err) {
        console.log(err);
      }
    });
  },
  loadData: function() {
    var this_ = this;
    wx.showLoading({
      title: '加载中...',
    }),
    wx.getStorage({
      key: "token",
      success: function(res) {
        res.data.accessToken ?
          wx.getStorage({
            key: "userInfo",
            success: function(o) {
              this_.userId = o.data.id,
              wx.request({
                url: 'https://peerer.cn/api/v1/uc/member/' + t.userId,
                method: "GET",
                header: {
                  Authorization: n.data.accessToken
                },
                success: function(n) {
                  n.data.status ?
                  (this_.userInfo = n.data.result,
                    this_.userInfo.avatar && this_.userInfo.nickName && this_.userInfo.sex ?
                    this_.userInfo.educationList || (wx.showToast({
                      title: '请完善教育信息',
                    }),
                    wx.navigateTo({
                      url: '/components/componet/home/eduInfoEdit?eduId=&eduLength=0',
                      fail: function(err) {
                        console.log(err);
                      }
                    })) :
                    (wx.showToast({
                      title: '请完善基本信息',
                    }),
                    this_.settingBaseInfo())) :
                    console.log(n.data.error),
                    wx.hideLoading(),
                    wx.stopPullDownRefresh();
                },
                fail: function(err) {
                  wx.hideLoading(),
                  wx.stopPullDownRefresh(),
                  console.log(err);
                }
              }), wx.request({
                url: 'https://peerer.cn/api/v1/bbs/post/discover',
                method: "GET",
                header: {
                  Authorization: n.data.accessToken
                },
                data: {
                  pageNo: 1,
                  pageSize: 10,
                  memberId: this_.userId? this_.userId : null
                },
                success: function(res) {
                  res.data.status ?
                    this_.tabList[1].count = Number(res.data.result.totalCount) :
                    console.log(res.data.error);
                },
                fail: function(err) {
                  console.log(err);
                }
              });
            }
          }) : wx.clearStorage();
      },
      fail: function(err) {
        console.log(err),
        wx.clearStorage(),
        wx.hideLoading(),
        wx.stopPullDownRefresh();
      }
    });
  },
  tabChange: function(tab) {
    this.currentTab = tab;
  },
  hasTag: function(tag) {
    if( !this.userInfo.tagsList) return false;
    for(var i = 0 ; i < this.userInfo.tagsList.length; i++ ){
      if(this.userInfo.tagsList[i].tag.category == 0){
        return true;
      }
      
    }
    return false;
  },
  toMessageDetail: function() {
    wx.navigateTo({
      url: '/components/component/messageDetail?userId=' + this.userId,
      fail: function(err) {
        console.log(err);
      }
    });
  },
  showSecondDegreeRecognized: function() {
    wx.navigateTo({
      url: '/components/component/friend?type=4&memberId=' + this.userId,
      fail: function(err) {
        console.log(err);
      }
    });
  },
  FriendZonetalCount: function(cnt) {
    this.tabList[1].count = cnt;
  },
  settingBaseInfo: function() {
    wx.navigateTo({
      url: '/components/component/home/settingBaseInfo',
      fail: function(err) {
        console.log(err);
      }
    });
  },
  editUserInfo: function() {
    this.isEditing = true;
  },
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
  savingUserInfo: function() {
    this.isEditing = false,
    this.loadData();
  },
  publish: function() {
    wx.navigateTo({
      url: '/components/component/publishFriendZone',
      fail: function(err) {
        console.log(err);
      }
    });
  },
  getMessageNumber: function() {
    wx.getStorage({
      key: "token",
      success: function(res) {
        res.data.accessToken ? 
          wx.request({
            url: 'https://peerer.cn/api/v1/uc/messageThread/latest',
            method: "GET",
            header: {
              Authorization: res.data.accessToken
            },
            success: function(t) {
              t.data.status ?
                t.data.result >= 1 ?
                  wx.setTabBarBadge({
                    index: 2,
                    text: t.data.result.toString(),
                  }) : wx.removeTabBarBadge({
                    index: 2,
                  }) : (console.log(t.data.error),
                  wx.removeTabBarBadge({
                    index: 2,
                 }));
            },
           fail: function(err) {
              console.log(err),
              wx.removeTabBarBadge({
                index: 2,
              });
            }
          }) : wx.clearStorage();
      },
      fail: function(err) {
        console.log(err),
        wx.removeTabBarBadge({
          index: 2,
        });
      }
    });
  },
  click_isLogin: function() {
    var this_ = this;
    wx.getStorage({
      key: "token",
      success: function(res) {
        res.data.accessToken ?
          this_.isLogin = true :
            (wx.clearStorage(),
            this_.isPhoneLogin || wx.login({
              provider: "weixin",
              success: function(res) {
                wx.setStorage({
                  key: "loginResCode",
                  data: res.code,
                  success: function() {
                    this_.isLogin = false;
                  }
                });
              },
              fail: function(err) {
                console.log(err),
                this_.isPhoneLogin = true;
              }
            }));
      },
      fail: function(res) {
        wx.clearStorage(),
        this_.isPhoneLogin ?
          this_.isLogin = true :
            wx.login({
              provider: "weixin",
              success: function(res) {
                wx.setStorage({
                  key: "loginResCode",
                  data: res.code,
                  success: function() {
                    this_.isLogin = false;
                  }
                });
              },
              fail: function(err) {
                console.log(err),
                this_.isPhoneLogin = true;
              }
            });
      }
    });
  },
  getPhoneNumber: function (res) { // 获取微信绑定手机号
    var this_ = this;
    this_.toMessageDetail.iv ? wx.getStorage({
      key: "loginResCode",
      success: function(n) {
        if(n.data) {
          var i = {
            encryptedData: this_.detail.encryptedData,
            iv: this_.detail.iv,
            code: n.data
          };
          wx.request({
            url: 'https://peerer.cn/api/v1/minapp/user/phone',
            method: 'POST',
            data: i,
            success: function(suc) {
              suc.data.status ?
                this_.initLogin(suc) : 
                (console.log(suc.data.error),
                this_.isPhoneLogin = true);
            },
            fail: function(err) {
              console.log(err),
              this_.isPhoneLogin = true;
            }
          });
        } else {
          this_.isPhoneLogin = true;
        }
      }
    }) : this_.isPhoneLogin = true;
  },
  codeChange: function(res) {
    this.codeText = res;
  },
  getCode(){ // 获取验证码
    var this_ = this;
    this.mobile ?
      /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(this.mobile) ?// 测试手机号格式
       this.canGetCode ? // 判断是否可以获取验证码（根据倒计时）
        (wx.showLoading({ // 可以获取验证码
          title: "正在获取验证码",
          icon: 'none'
          }), 
          wx.request({ // 从后端获取验证码
            url: 'https://peerer.cn/api/v1/uc/member/verifycode',
            method: "POST",
            data: {
              module: "login",
              type: "sms",
              key: this.mobile
            },
            success: function(res) { // 获取成功，显示等待信息
              res.data.status ? 
                setTimeout(function() { //设置定时器
                  wx.hideLoading(), 
                  this.start();
                }, 1000) 
              : (wx.hideLoading(), 
                console.log(res.data.error),
                wx.showToast({
                  title: '获取验证码错误',
                  icon: 'none'
                }));
            },
            fail: function(err) {
              wx.hideLoading(), 
              console.log(err), 
              wx.showToast({
                title: '获取验证码错误',
                icon: 'none'
              })
            }
          })
        ) : (wx.showToast({ // 不能获取Code
          title: '倒计时结束后再发送',
          icon: 'none'
          }))
      :  (wx.showToast({ 
        title: '"手机号格式不正确"',
        icon: 'none'
        })
      ) 
     :  (wx.showToast({ // this.mobile为空 
        title: '请输入手机号',
        icon: 'none'
      })
    )
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
  /*
  initLogin: function(res) {
    var this_ = this, token = {}, accessToken = "";
    res.data.result.token ?
      (token = res.data.result.token, accessToken = res.data.result.token.accessToken)
      : (token.accessToken = res.data.result.accessToken,
        token.refreshToken = res.data.result.refreshToken,
        accessToken = res.data.result.accessToken),
        wx.setStorage({
          key: "token",
          data: token,
          success: function() {
            var o = i(a.default.mark(function o() {
              return a.default.wrap(function(o) {
                for(;;) {
                  switch (o.prev = o.next) {
                    case 0:
                      return o.next = 2,
                      wx.request({
                        url: 'url',
                      })
                    case 2:
                    case 4:
                    case 6:
                    case 8:
                    case "end":
                      return o.stop();
                  }
                };
            }));
            return function() {
              return o.apply(this, arguments);
            };
          }
        });
      },
      refresh: function(){
        this.click_isLogin(),
        this.loadData(),
        this.getMessageNumber();
      }
    })
  }*/
})