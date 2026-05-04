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
    list: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    searchKeyword: '',
    currentSearch: ''
  },

  onLoad() {
    this.loadData();
    this.loadCount();
  },

  onShow() {
    this.loadCount();
  },

  onPullDownRefresh() {
    this.setData({
      list: [],
      page: 1,
      hasMore: true,
      searchKeyword: '',
      currentSearch: ''
    });
    Promise.all([this.loadData(), this.loadCount()]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearch() {
    const keyword = this.data.searchKeyword.trim();
    this.setData({
      currentSearch: keyword,
      page: 1,
      hasMore: true,
      list: []
    });
    this.loadData();
  },

  clearSearch() {
    this.setData({
      searchKeyword: '',
      currentSearch: '',
      page: 1,
      hasMore: true,
      list: []
    });
    this.loadData();
  },

  async loadData() {
    if (this.data.loading) return;
    this.setData({ loading: true });

    try {
      const res = await get('/api/candidates', {
        page: this.data.page,
        pageSize: this.data.pageSize,
        keyword: this.data.currentSearch,
      });

      const rawList = res.data.list || [];
      const total = res.data.total || 0;

      const processedList = rawList.map((item, idx) => ({
        ...item,
        age: calcAge(item.dob),
        avatarColor: AVATAR_COLORS[(item.id || idx) % AVATAR_COLORS.length],
        languageTags: [item.native_language, item.chinese_level, item.other_languages]
          .filter(Boolean)
          .join(' / ')
      }));

      const newList = this.data.page === 1
        ? processedList
        : [...this.data.list, ...processedList];

      this.setData({
        list: newList,
        hasMore: newList.length < total,
        loading: false
      });

    } catch (err) {
      console.error('加载人选失败:', err);
      this.setData({ loading: false });
    }
  },

  async loadCount() {
    try {
      const res = await get('/api/candidates', { page: 1, pageSize: 1 });
      this.setData({
        totalCount: (res.data && res.data.total) || 0
      });
    } catch (err) {
      console.error('获取统计失败:', err);
    }
  },

  loadMore() {
    if (!this.data.hasMore || this.data.loading) return;
    this.setData({ page: this.data.page + 1 });
    this.loadData();
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });
  }
});
