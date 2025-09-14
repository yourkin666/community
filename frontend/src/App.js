import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CreateArticlePage from './pages/CreateArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/App.css';

const { Content, Footer } = Layout;

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // 判断是否为登录或注册页面
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) {
    // 登录和注册页面使用简化布局
    return (
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header />
        <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Content>
      </Layout>
    );
  }

  // 其他页面使用完整布局
  return (
    <Layout className="layout">
      <Header />
      <Content style={{ padding: '0 50px', minHeight: 'calc(100vh - 134px)' }}>
        <div className="site-layout-content">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/articles/:id" element={
              <ProtectedRoute>
                <ArticleDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/create-article" element={
              <ProtectedRoute>
                <CreateArticlePage />
              </ProtectedRoute>
            } />
            <Route path="/edit-article/:id" element={
              <ProtectedRoute>
                <EditArticlePage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        交流社区 ©2024 Created by Community Team
      </Footer>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
