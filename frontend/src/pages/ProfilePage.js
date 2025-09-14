import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Avatar, List, Tag, Space, message, Tabs } from 'antd';
import { UserOutlined, EditOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { articleService } from '../services/articleService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      });
      fetchMyArticles();
    }
  }, [user, isAuthenticated, navigate, form]);

  const fetchMyArticles = async () => {
    try {
      setArticlesLoading(true);
      const response = await articleService.getMyArticles();
      if (response.success) {
        setArticles(response.data);
      } else {
        message.error('获取文章列表失败');
      }
    } catch (error) {
      message.error('获取文章列表失败');
    } finally {
      setArticlesLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await userService.updateProfile({
        avatar: values.avatar,
        bio: values.bio,
      });
      
      if (response.success) {
        updateUser(response.data);
        message.success('个人资料更新成功');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('更新个人资料失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const profileTab = (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Avatar 
          size={100} 
          icon={<UserOutlined />} 
          src={user.avatar}
          style={{ marginBottom: '16px' }}
        />
        <Title level={3}>{user.username}</Title>
        <Text type="secondary">{user.email}</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="用户名"
          name="username"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="头像URL"
          name="avatar"
        >
          <Input placeholder="请输入头像图片链接" />
        </Form.Item>

        <Form.Item
          label="个人简介"
          name="bio"
        >
          <TextArea 
            placeholder="介绍一下自己吧" 
            rows={4}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ width: '100%' }}
          >
            更新资料
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const articlesTab = (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>我的文章</Title>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/create-article')}>
          发布新文章
        </Button>
      </div>

      <List
        loading={articlesLoading}
        dataSource={articles}
        renderItem={(article) => (
          <List.Item
            actions={[
              <Link to={`/articles/${article.id}`}>查看</Link>,
              <Link to={`/edit-article/${article.id}`}>编辑</Link>,
            ]}
          >
            <List.Item.Meta
              title={
                <Link to={`/articles/${article.id}`}>
                  {article.title}
                </Link>
              }
              description={
                <div>
                  <Text type="secondary" ellipsis>
                    {article.summary || article.content}
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Space>
                      <Tag color={article.status === 'PUBLISHED' ? 'green' : 'orange'}>
                        {article.status === 'PUBLISHED' ? '已发布' : '草稿'}
                      </Tag>
                      <Space size="small">
                        <CalendarOutlined />
                        <Text type="secondary">{formatDate(article.createdAt)}</Text>
                      </Space>
                      <Space size="small">
                        <EyeOutlined />
                        <Text type="secondary">{article.viewCount}</Text>
                      </Space>
                    </Space>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <div style={{ padding: '24px 0', maxWidth: '800px', margin: '0 auto' }}>
      <Tabs
        defaultActiveKey="profile"
        items={[
          {
            key: 'profile',
            label: '个人资料',
            children: profileTab,
          },
          {
            key: 'articles',
            label: `我的文章 (${articles.length})`,
            children: articlesTab,
          },
        ]}
      />
    </div>
  );
};

export default ProfilePage;
