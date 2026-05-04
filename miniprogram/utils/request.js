/**
 * 统一网络请求封装
 */
const app = getApp();

const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.serverUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          wx.showToast({ title: res.data?.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络错误', icon: 'none' });
        reject({ code: -1, message: '网络错误', detail: err });
      }
    });
  });
};

// GET 简写
const get = (url, data) => request({ url, method: 'GET', data });

// POST 简写
const post = (url, data) => request({ url, method: 'POST', data });

module.exports = { request, get, post };
