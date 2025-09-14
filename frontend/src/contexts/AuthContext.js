import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 检查用户登录状态
  const checkAuthStatus = async () => {
    try {
      const response = await userService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.log('用户未登录');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 登录
  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);
      if (response.success) {
        setUser(response.data);
        message.success(response.message);
        return true;
      } else {
        message.error(response.message);
        return false;
      }
    } catch (error) {
      message.error('登录失败，请重试');
      return false;
    }
  };

  // 注册
  const register = async (userData) => {
    try {
      const response = await userService.register(userData);
      if (response.success) {
        message.success(response.message);
        return true;
      } else {
        message.error(response.message);
        return false;
      }
    } catch (error) {
      message.error('注册失败，请重试');
      return false;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await userService.logout();
      setUser(null);
      message.success('已成功登出');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 更新用户信息
  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
