export default defineAppConfig({
  pages: [
    'pages/ride-today/index',
    'pages/exception/index',
    'pages/messages/index',
    'pages/settings/index',
    'pages/exception-detail/index',
    'pages/leave-request/index',
    'pages/station-manage/index',
    'pages/contact-manage/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2E7DFF',
    navigationBarTitleText: '安心校车',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2E7DFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/ride-today/index',
        text: '今日乘车'
      },
      {
        pagePath: 'pages/exception/index',
        text: '异常确认'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息记录'
      },
      {
        pagePath: 'pages/settings/index',
        text: '接送设置'
      }
    ]
  }
})
