// components/component/home/eduInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    degree: void 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDegree: function() {
      var this_ = this;
      wx.getStorage({
        key: "degree",
        success: function(res) {
          this_.degree = res.data;
        }
      });
    },
    switchSN: function(n, t) {
      var this_ = this;
      wx.showLoading({
        title: '加载中...',
      }),
      wx.getStorage({
        key: "token",
        success: function(r) {
          r.data.accessToken ?
            wx.request({
              url: 'https://peerer.cn/api/v1/uc/educationExperience/switchSN',
              method: 'PUT',
              header: {
                Authorization: r.data.accessToken
              },
              data: {
                sourceId: this_.items[n].id,
                targetId: this_.items[t].id
              },
              success: function(res) {
                res.data.status?
                  this_.$emit("refresh") :
                  console.log(res.data.error);
              },
              fail: function(err) {
                console.log(err);
              }
            }) : (wx.clearStorage(),
              wx.switchTab({
                url: '/pages/find/find',
                success: function() {
                  var page = getCurrentPages().pop();
                  void 0 != page && nul != page && page.onLoad();
                },
                fail: function(err) {
                  console.log(err);
                }
              }));
        },
        fail: function(err) {
          console.log(err),
          wx.clearStorage(),
          wx.switchTab({
            url: '/pages/find/find',
            success: function() {
              var page = getCurrentPages().pop();
              void 0 != page && nul != page && page.onLoad();
            },
            fail: function(err) {
              console.log(err);
            }
          });
        }
      });
    },
    toEduInfoEdit: function(res) {
      var len = 0;
      this.items && (len = this.items.length),
      wx.navigateTo({
        url: '/components/component/home/eduInfoEdit?eduInfoEdit?eduId=' + n + "&eduLength=" + len,
        fail: function(err) {
          console.log(err);
        }
      });
    },
    eduFormartter: function(res) {
      if(this.degree) {
        var eduInfo = res.school.name + " · " + res.specialism.name + " · ";
        return this.degree.forEach(function(t) {
          t.dictValue == res.degree && (eduInfo += t.dictShowName);
        }), eduInfo += " · " + res.grade;
      }
    }
  }
})
