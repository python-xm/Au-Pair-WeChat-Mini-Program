const { get } = require('../../utils/request');

const AVATAR_COLORS = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  '#4facfe', '#00f2fe', '#43e97b', '#fa709a',
  '#fee140', '#30cfd0'
];

function calcAge(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age > 0 ? age : '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

Page({
  data: {
    candidateId: null,
    candidate: {},
    age: '',
    loading: true,
    showVideo: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ candidateId: options.id });
      this.loadDetail(options.id);
    }
  },

  async loadDetail(id) {
    this.setData({ loading: true });

    try {
      const res = await get('/api/candidates/' + id);
      const candidate = res.data || {};

      candidate.avatarColor = AVATAR_COLORS[(candidate.id || id) % AVATAR_COLORS.length];
      if (candidate.earliest_arrival) {
        candidate.earliest_arrival_fmt = formatDate(candidate.earliest_arrival);
      }
      if (candidate.latest_arrival) {
        candidate.latest_arrival_fmt = formatDate(candidate.latest_arrival);
      }

      this.setData({
        candidate,
        age: calcAge(candidate.dob),
        loading: false,
      });

      wx.setNavigationBarTitle({
        title: (candidate.name || '互惠生详情')
      });

    } catch (err) {
      console.error('加载详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  playVideo() {
    this.setData({ showVideo: true });
  },

  closeVideo() {
    this.setData({ showVideo: false });
  },

  onVideoError(e) {
    console.error('视频播放错误:', e.detail);
    wx.showToast({ title: '视频加载失败', icon: 'none' });
  },

  onShareTap() {
    // share button covers this area
  },

  onShareAppMessage() {
    const { candidate } = this.data;
    return {
      title: (candidate && candidate.name) + ' - 互惠生人选',
      path: '/pages/detail/detail?id=' + this.data.candidateId,
    };
  },

  onShareTimeline() {
    const { candidate } = this.data;
    return {
      title: (candidate && candidate.nationality) + ' ' + (candidate && candidate.name),
      query: 'id=' + this.data.candidateId,
    };
  }
});
