// components/component/userInfo.js
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
    defaultAvatar: "/images/defaultAvatar.jpg",
    userId: "",
    userInfo: {},
    secondDegreeRecognizeds: {
      totalCount: 0
    },
    currentTab: 0,
    tabList: [{
      name: "名片"
    }, {
      name: "动态",
      count: 0
    }],
    degree: {},
    experience: {},
    industry: {},
    showPopUpImage: false,
    topicId: "",
    topicType: "",
    topicIcon: "",
    topicName: "",
    page: {
      pageNo: 1,
      pageSize: 10,
      data: []
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})