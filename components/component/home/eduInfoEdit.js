// components/component/home/eduInfoEdit.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: false
  },
  /**
   * 组件的初始数据
   */
  data: {
    form: {
      degree: "",
      degreeName: "",
      grade: "",
      school: {
        name: "",
        id: ""
      },
      specialism: {
        name: "",
        id: ""
      },
      id: ""
    },
    gradeSettingVisible: false,
    gradeList: [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2011],
    degreeSettingVisible: false,
    degreeList: ["本科", "硕士", "博士"],
    schoolSettingVisible: false,
    schoolList: [],
    specialism: void 0,
    majorList: [],
    majorSettingVisible: false,
    activeSpecialism: void 0,
    degree: void 0,
    eduLength: 0,
    activeGroup: "",
    schools: [],
    selectSchoolName: "",
    showSchoolList: false,
    searchSchoolList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectSchoolName: function(school) {
      if(school) {
        this.data.showSchoolList = false;
        this.searchSchool(school);
      } else {
        this.data.showSchoolList = true;
      }
    },
    getSpecialism: function() {
      var this_ = this;
      wx.getStorage({
        key: "specialism",
        success (res) {
          this_.data.specialism = res.data;
        }
      });
    },
    getDegree: function() {
      var this_ = this;
      wx.getStorage({
        key: "degree",
        success (res) {
          this_.data.degree = res.data;
        }
      });
    },
    getSchoolList: function() {
      var this_ = this;
      wx.showLoading({
        title: '加载中...',
      }),
      wx.getStorage({
        key: "token",
        success (res) {
          if(res.data.accessToken){
            wx.request({
              url: 'https://peerer.cn/api/v1/base/school',
              method: 'GET',
              header: {
                Authorization: res.data.accessToken
              },
              success (res1) {
                if(res1.data.status){
                  res1.data.result.forEach(function(sch_item) {
                    this_.schoolList.push(sch_item);
                  })
                } else {
                  console.log(res1.data.error),
                  wx.hideLoading();
                }
              },
              fail (err) {
                console.log(err);
                wx.hideLoading();
              }
            })
          } else {
            wx.clearStorage(),
            wx.switchTab({
              url: '/pages/association/association',
              success () {
                var page = getCurrentPages().pop();
                void 0 != page && null != page && page.onLoad();
              },
              fail (err) {
                console.log(err);
              }
            })
          }
        },
        fail (err) {
          console.log(err),
          wx.clearStorage(),
          wx.switchTab({
            url: '/pages/association/association',
            success () {
              var page = getCurrentPages().pop();
              void 0 != page && null != page && page.onLoad();
            },
            fail (err) {
              console.log(err);
            }
          })
        }
      })
    },
    setSchool: function(school) {
      if(school){
        this.data.form.school.name = school.name;
        this.data.form.school.id = school.id;
        this.data.form.specialism.name = "";
        this.data.form.specialism.id = "";
      }
      this.schoolSettingVisible = false;
    },
    openMajorSettingVisible: function() {
      var this_ = this;
      if(this.data.form.school.id) {
        wx.showLoading({
          title: '加载中...',
        }),
        wx.getStorage({
          key: "token",
          success (res) {
            if(res.data.accessToken){
              this_.activeSpecialism = this_.specialism[0].dictValue,
              wx.request({
                url: 'https://peerer.cn/api/v1/base/specialism/' + this_.data.form.school.id + "/school",
                method: 'GET',
                header: {
                  Authorization: res.data.accessToken
                },
                success (res1) {
                  if(res1.data.status) {
                    res1.data.result.forEach(function(major_item) {
                      this_.majorList.push(major_item);
                    },
                    this_.majorSettingVisible = true);
                  }
                }
              })
            }
          }
        })
      }
    }
  }
})
