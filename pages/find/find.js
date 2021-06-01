// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 70 + 'px',
    status: "loadmore",
    page: {
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      data: []
    },
    userInfo: {},
    userId: "",
    degree: void 0,
    experience: void 0,
    industry: void 0,
    onRefresh: false,
    tagList: [],
    tagListStatic: [ {
      topicIcon: "✨",
      topicId: "10",
      topicName: "日常",
      topicType: 0
    }, {
      topicIcon: "📔",
      topicId: "12",
      topicName: "记录",
      topicType: 0
    }, {topicIcon: "👨‍💻",
      topicId: "11",
      topicName: "实习",
      topicType: 5
    }, {topicIcon: "🛰️",
      topicId: "10",
      topicName: "留学",
      topicType: 5
    }],
    showTagPopup: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onRefresh: function (e) {
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
  loadNextPage: function() {
    this.page.totalCount > this.page.data.length && (this.page.pageNo++, this.loadData());
  },
  loadData: function() {
    var this_ = this;
    this.status = "loading";
        /*wx.getStorage({
      key: "token",
      success: function(storage) {
        storage.data.accessToken ? (
          wx.request({
            url: 'https://peerer.cn/api/v1/uc/member/'+this.userId,
            method: 'GET',
            header: {
              Authorization: storage.data.accessToken
            },
            success: function(res) {
              res.data.status ?
                res.data.result.avatar && res.data.result.nickName && res.data.result.sex ? res.data.result.educationList || ((
                  wx.showToast({
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
                  wx.navigateTo({
                    url: '/components/componet/home/settingBaseInfo',
                  })
                }))
            }
          })
        )
      }
    })*/
  },
  publish: function() {
    wx.navigateTo({
      url: '/components/component/publishFriendZone',
      fail: function(err) {
        console.log(err);
      }
    });
  },
  refresh: function() {
    this.page = {
      pageNo : 1,
      pageSize: 10,
      totalCount: 0,
      data: []
    },
    this.tagList = [],
    this.getTag(),
    this.loadData(),
    this.getMessageNumber();
  },
  toPersonal: function() {
    this.showTagPopup = false,
    wx.getStorage({
      key: "token",
      success: function(res) {
        res.data.accessToken ?
         wx.switchTab({
           url: '/pages/mine/mine',
           success: function() {
             var page = getCurrentPages().pop();
             void 0 != page && null != page && page.onLoad();
           },
           fail: function(err) {
             console.log(err);
           }
         }) : wx.clearStorage();
      },
      fail: function(err) {
        console.log(err),
        wx.clearStorage();
      }
    });
  },
  toCircle: function(res) {
    wx.getStorage({
      key: "token",
      success (res) {
        if(res.data.accessToken) {
          var icon = this.topicIcon ? this.topicIcon : "";
          wx.navigateTo({
            url: '/components/component/friendZoneCircle?topicId=' + this.topicId + '&topicType=' + this.topicType + "&topicIcon=" + icon + "&topicName=" + this.topicName,
            fail (err) {
              console.log(err);
            }
          });
        } else {
          wx.clearStorage();
        }
      },
      fail (err) {
        console.log(err);
        wx.clearStorage();
      }
    })
  },
  getTag: function() {
    var this_ = this;
    wx.getStorage({
      key: "token",
      success (res) {
        res.data.accessToken ? 
          wx.request({
            url: 'https://peerer.cn/api/v1/uc/topic',
            method: 'GET',
            header: {
              Authorization: n.data.accessToken
            },
            success (res) {
              res.data.status ?
                (this_.tagList = res.data.result.slice(0,2),
                 this_.tagList.push.apply(this_.tagList, this_.tagListStatic)) : 
                 console.log(res.data.error);
            },
            fail (err) {
              console.log(err);
            }
          }) : wx.clearStorage();
      },
      fail (err) {
        console.log(err),
        wx.request({
          url: 'https://peerer.cn/api/v1/uc/topic',
          method: "GET",
          success (res) {
            res.data.status ?
            (this_.tagList = res.data.result.slice(0, 2),
            this_.tagList.push.apply(this_.tagList, this_.tagListStatic))
            : console.log(res.data.error);
          }
        });
      }
    });
  },
  getMessageNumber: function() {
    wx.getStorage({
      key: "token",
      success (res) {
        this.data.accessToken ? 
        wx.request({
          url: 'https://peerer.cn/api/v1/uc/messageThread/latest',
          method: 'get',
          header: {
            Authorization: t.data.accessToken
          },
          success (res) {
            res.data.status? 
            res.data.result >= 1 ?
            wx.setTabBarBadge({
              index: 2,
              text: this.data.result.toString(),
            }) : wx.removeTabBarBadge({
              index: 2,
            }) : (console.log(this.data.error),
            wx.removeTabBarBadge({
              index: 2,
            }));
          },
          fail (err) {
            console.log(err),
            wx.removeTabBarBadge({
              index: 2,
            });
          }
        }) : wx.clearStorage();
      },
      fail (err) {
        console.log(err),
        wx.removeTabBarBadge({
          index: 2,
        });
      }
    });
  },
})