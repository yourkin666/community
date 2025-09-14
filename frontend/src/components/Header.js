import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, EditOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to="/profile">个人资料</Link>,
      },
      {
        key: 'create-article',
        icon: <EditOutlined />,
        label: <Link to="/create-article">发布文章</Link>,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  const menuItems = isAuthenticated ? [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
  ] : [];

  return (
    <AntHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo">
          {isAuthenticated ? (
            <Link to="/">
              交流社区
            </Link>
          ) : (
            <span>
              交流社区
            </span>
          )}
        </div>
        {isAuthenticated && (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ flex: 1, minWidth: 0 }}
          />
        )}
      </div>

      <div>
        {isAuthenticated ? (
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/create-article')}>
              发布文章
            </Button>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer', color: 'white' }}>
                <Avatar size="small" icon={<UserOutlined />} src={user?.avatar} />
                <span>{user?.username}</span>
              </Space>
            </Dropdown>
          </Space>
        ) : (
          <Space>
            <Button type="default" onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              注册
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
