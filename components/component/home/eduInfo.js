// components/component/home/eduInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array,
      default: []
    }
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
          this_.data.degree = res.data;
        }
      });
    },
    switchSN: function(source, target) {
      var this_ = this;
      wx.showLoading({
        title: '加载中...',
      }),
      wx.getStorage({
        key: "token",
        success: function(res) {
          if(res.data.accessToken) {
            wx.request({
              url: 'https://peerer.cn/api/v1/uc/educationExperience/switchSN',
              method: 'PUT',
              header: {
                Authorization: res.data.accessToken
              },
              data: {
                sourceId: this_.items[source].id,
                targetId: this_.items[target].id
              },
              success: function(res) {
                if(res.data.status){
                  this_.triggerEvent('refresh') 
                } else {
                  console.log(res.data.error);
                }
              },
              fail: function(err) {
                console.log(err);
              }
            })
          } else {
              wx.clearStorage(),
              wx.switchTab({
                url: '/pages/association/association',
                success: function() {
                  var page = getCurrentPages().pop();
                  if(0 == page || null == page || !page.onLoad()){
                    console.log('pageError');
                  }
                },
                fail: function(err) {
                  console.log(err);
                }
              })
          }
        },
        fail: function(err) {
          console.log(err),
          wx.clearStorage(),
          wx.switchTab({
            url: '/pages/association/association',
            success: function() {
              var page = getCurrentPages().pop();
              if(0 == page || null == page || !page.onLoad()){
                console.log('pageError');
              }
            },
            fail: function(err) {
              console.log(err);
            }
          });
        }
      });
    },
    toEduInfoEdit: function(eduId) {
      var len = 0;
      if(this.items) {
        len = this.items.length;
      }
      wx.navigateTo({
        url: '/components/component/home/eduInfoEdit?eduId=' + eduId + "&eduLength=" + len,
        fail: function(err) {
          console.log(err);
        }
      });
    },
    eduFormartter: function(res) {
      if(this.degree) {
        var eduText = res.school.name + " · " + res.specialism.name + " · ";
        return this.degree.forEach(
          function(t) {
          if(t.dictValue == res.degree) {
            eduText += t.dictShowName;
          }
          },
          eduText += " · " + res.grade
        )
      }
    } 
  }
})
