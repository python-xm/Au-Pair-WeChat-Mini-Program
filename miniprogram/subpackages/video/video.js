Page({
  data: {
    videoUrl: ''
  },

  onLoad(options) {
    if (options.url) {
      this.setData({ videoUrl: decodeURIComponent(options.url) });
    }
  },

  onVideoError(e) {
    console.error('视频播放错误:', e.detail);
    wx.showToast({
      title: '视频加载失败',
      icon: 'none'
    });
  },

  onVideoPlay() {
    console.log('视频开始播放');
  }
});
