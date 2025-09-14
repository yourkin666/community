import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true, // 支持跨域cookie
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      
      if (status === 401) {
        // 未授权，跳转到登录页
        window.location.href = '/login';
      } else if (status === 403) {
        // 禁止访问
        console.error('访问被禁止');
      } else if (status === 404) {
        // 资源未找到
        console.error('资源未找到');
      } else if (status >= 500) {
        // 服务器错误
        console.error('服务器错误');
      }
      
      return Promise.reject(data || error.response);
    } else if (error.request) {
      // 网络错误
      console.error('网络错误，请检查网络连接');
      return Promise.reject({ message: '网络错误，请检查网络连接' });
    } else {
      // 其他错误
      console.error('请求错误:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;
