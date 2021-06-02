// components/component/home/settingBaseInfo.js
Component({
  /**
   * 组件的属性列表
   */ 
  properties: {
    value: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultAvatar: "/images/defaultAvatar.jpg",
    userId: "",
    userInfo: {},
    sexName: "",
    userForm: {
      nickName: "",
      sex: "",
      birthDate: "",
      remark: "",
      avatar: "",
      avatarUrl: ""
    },
    sexSettingVisible: false,
    birthdaySettingVisible: false,
    pickerParams: {
      year: true,
      month: true,
      day: true,
      hour: false,
      minute: false,
      second: false,
    },
    endYear: new Date().getFullYear(),
    remark: "",
    tempFilePath: "",
    cropFilePath: "",
    nickName: "",
    showImageCropper: false,
    weChatUserInfo: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    remark: function(remark) {
      this.data.userForm.remark = remark;
    },
    nickName: function(nickname) {
      if(nickname){
        this.data.userForm.nickName = nickname;
      }
    },
    loadData: function() {
      var this_ = this;
      wx.showLoading({
        title: '加载中...',
      }),
      wx.getStorage({
        key: "token",
        success (res) {
          if(res.data.accessToken){
            wx.getStorage({
              key: "userInfo",
              success (res1) {
                this_.userId = res1.data.id;
                this_.userInfo = res1.data;
                wx.request({
                  url: 'https://peerer.cn/api/v1/uc/member/simpleInfo',
                  method: 'GET',
                  header: {
                    Authorization: res.data.accessToken
                  },
                  success (res2) {
                    if(res2.data.status) {
                      this_.userForm.sex = res2.data.result.member.sex;
                      this_.userForm.nickName = res2.data.result.member.nickName;
                      this_.nickName = this_.userForm.nickName;
                      this_.userForm.avatar = res2.data.result.member.avatar;
                      this_.userForm.avatarUrl = res2.data.result.member.avatarUrl;
                      this_.userForm.avatarUrl && (this_.weChatUserInfo = false),
                      this_.tempFilePath = this_.userForm.avatarUrl;
                      this_.userForm.birthDate = res2.data.result.member.birthDate;
                      this_.remark = res2.data.result.member.remark;
                      this_.sexName = res2.data.result.member.sex ? Number(res2.data.result.member.sex) ? "女" : "男" : "";
                    } else {
                      console.log(res2.data.error);
                      wx.hideLoading();
                    }
                  },
                  fail (err) {
                    console.log(err);
                    wx.hideLoading();
                  }
                })
              }
            })
          } else {
            wx.clearStorage(),
            wx.switchTab({
              url: '/pages/mine/mine',
              success () {
                var e = getCurrentPages().pop();
                void 0 != e && null != e && e.onLoad();
              },
              fail (err) {
                console.log(error);
              }
            })
          }
        },
        fail (err) {
          console.log(err),
          wx.clearStorage(),
          wx.switchTab({
            url: '/pages/mine/mine',
            success () {
              var e = getCurrentPages().pop();
              void 0 != e && null != e && e.onLoad();
            },
            fail (err) {
              console.log(err);
            }
          })
        }
      })
    },
    uploadImage: function() {
      var this_ = this;
      this.weChatUserInfo || wx.chooseImage({
        count: 1,
        success (res) {
          console.log(res);
          this_.tempFilePath = wx.tempFilePath[0];
          this_.showImageCropper = true;
        }
      })
    },
    confirmCrop: function(e) {
      this.tempFilePath = "";
      this.cropFilePath = e.detail.tempFilePath;
      this.showImageCropper = false;
    },
    cancleCrop: function() {
      this.tempFilePath = "";
      this.cropFilePath = "";
      this.showImageCropper = true;
    },
    setSex: function(sex) {
      this.sexName = sex[0]? "女" : "男",
      this.userForm.sex = sex[0].toString();
    },
    setBirthday: function(birth) {
      this.userForm.birthDate = birth.year + "-" + birth.month + "-" + birth.day;
    },
    editUserInfo: function() {
      var this_ = this;
      if(this.cropFilePath || this.userForm.avatarUrl) {
        if(this.userForm.nickName) {
          if(this.userForm.nickName.length < 2) {
            wx.showToast({
              title: '名字太短了，至少两个字吧',
            })
          } else {
            if(this.userForm.sex) {
              if(this.userForm.birthDate){
                wx.getStorage({
                  key: 'token',
                  success () {
                    //待补充
                  },
                  fail (err) {
                    console.log(err);
                    wx.clearStorage();
                    wx.switchTab({
                      url: '/pages/mine/mine',
                      success () {
                        var e = getCurrentPages().pop();
                        void 0 != e && null != e && e.onLoad();
                      },
                      fail (err) {
                        console.log(err);
                      }
                    });
                  }
                })
              } else {
                wx.showToast({
                  title: '设置一下自己生日吧',
                })
              }
            } else {
              wx.showToast({
                title: '选择一下自己的性别吧',
              })
            }
          }
        } else {
          wx.showToast({
            title: '给自己取个名字吧',
          })
        }
      } else {
        wx.showToast({
          title: '传张生活照吧',
        })
      }
    },
    editUserInfoUpdata: function(accesstoken) {
      wx.request({
        url: 'https://peerer.cn/api/v1/uc/member/fill',
        method: 'POST',
        header: {
          Authorization: accesstoken
        },
        data: this.userForm,
        success (res) {
          if(res.data.status) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          } else {
            console.log(res.data.error);
            wx.hideLoading();
          }
        },
        fail (err) {
          console.log(err);
          wx.hideLoading();
        }
      })
    },
    getWechatUserInfo: function() {
      var this_ = this;
      if(this.weChatUserInfo) {
        wx.getStorage({
          key: "token",
          success (res) {
            if(res.data.accessToken) {
              var that = this_;
              wx.getUserProfile({
                desc: '用于完善用户基本信息',
                success (res1) {
                  var simpleinfo = {
                    avatarUrl: res1.userInfo.avatarUrl.slice(0, -3) + "0",
                    nickName: res1.userInfo.nickName,
                    gender: res1.userInfo.gender
                  };
                  console.log(simpleinfo);
                  wx.request({
                    url: 'https://peerer.cn/api/v1/minapp/user/myinfo',
                    method: 'POST',
                    header: {
                      Authorization: res1.data.accessToken
                    },
                    data: simpleinfo,
                    success (res2) {
                      if(res2.data.status) {
                        that.weChatUserInfo = false;
                        that.loadData();
                      } else {
                        console.log(res2.data.error);
                      }
                    },
                    fail (err) {
                      console.log(err);
                    }
                  })
                },
                fail (err) {
                  console.log(err);
                  wx.showToast({
                    title: '请完善用户信息',
                  });
                  that.weChatUserInfo = false;
                }
              })
            } else {
              wx.clearStorage();
            }
          },
          fail (err) {
            console.log(err);
          }
        })
      }
    }

  }
})
