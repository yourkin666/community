import api from './api';

export const userService = {
  // 用户注册
  register: (userData) => {
    return api.post('/users/register', userData);
  },

  // 用户登录
  login: (credentials) => {
    return api.post('/users/login', credentials);
  },

  // 用户登出
  logout: () => {
    return api.post('/users/logout');
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return api.get('/users/current');
  },

  // 更新用户资料
  updateProfile: (userData) => {
    return api.put('/users/profile', userData);
  },

  // 根据用户名获取用户信息
  getUserByUsername: (username) => {
    return api.get(`/users/${username}`);
  }
};
