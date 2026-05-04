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

Page({
  data: {
    searchKeyword: '',
    banners: [
      '/banners/循环1.jpg',
      '/banners/循环2.jpg',
      '/banners/循环4.jpg',
      '/banners/循环5.jpg',
      '/banners/循环5 (2).jpg',
      '/banners/循环6.jpg'
    ],
    functionBtns: [
      { icon: '/btn-intro.png', label: '项目介绍' },
      { icon: '/btn-candidates.png', label: '互惠人选' },
      { icon: '/btn-family.png', label: '家庭报名' },
      { icon: '/btn-contact.png', label: '联系我们' }
    ],
    candidateList: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    currentKeyword: ''
  },

  onLoad() {
    this.loadCandidates();
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true,
      candidateList: [],
      currentKeyword: ''
    });
    this.loadCandidates().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearch() {
    const keyword = this.data.searchKeyword.trim();
    this.setData({
      currentKeyword: keyword,
      page: 1,
      hasMore: true,
      candidateList: []
    });
    this.loadCandidates(keyword);
  },

  clearSearch() {
    this.setData({
      searchKeyword: '',
      currentKeyword: '',
      page: 1,
      hasMore: true,
      candidateList: []
    });
    this.loadCandidates();
  },

  async loadCandidates(keyword) {
    const searchKey = keyword !== undefined ? keyword : this.data.currentKeyword;

    this.setData({ loading: true });

    try {
      const res = await get('/api/candidates', {
        page: this.data.page,
        pageSize: this.data.pageSize,
        keyword: searchKey,
      });

      const list = res.data.list || [];
      const total = res.data.total || 0;

      const listWithColor = list.map((item, index) => ({
        ...item,
        age: calcAge(item.dob),
        avatarColor: AVATAR_COLORS[(item.id || index) % AVATAR_COLORS.length],
        languageTags: [item.native_language, item.chinese_level, item.other_languages]
          .filter(Boolean)
          .join(' / ')
      }));

      const newList = this.data.page === 1
        ? listWithColor
        : [...this.data.candidateList, ...listWithColor];

      this.setData({
        candidateList: newList,
        hasMore: newList.length < total,
        loading: false
      });

    } catch (err) {
      console.error('加载人选列表失败:', err);
      this.setData({ loading: false });
    }
  },

  loadMore() {
    this.setData({ page: this.data.page + 1 });
    this.loadCandidates();
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  onFuncBtnTap(e) {
    const { index } = e.currentTarget.dataset;
    switch (index) {
      case 0:
        wx.navigateTo({
          url: '/subpackages/intro/intro'
        });
        break;
      case 1:
        wx.switchTab({
          url: '/pages/candidates/candidates'
        });
        break;
      case 2:
        wx.navigateTo({
          url: '/subpackages/video/video'
        });
        break;
      case 3:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
        break;
    }
  }
});
