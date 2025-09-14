import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Space, Tag, Typography, Spin, Empty, message } from 'antd';
import { Link } from 'react-router-dom';
import { EyeOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { articleService } from '../services/articleService';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getPublishedArticles();
      if (response.success) {
        setArticles(response.data);
      } else {
        message.error('获取文章列表失败');
      }
    } catch (error) {
      message.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        欢迎来到交流社区
      </Title>
      
      {articles.length === 0 ? (
        <Empty
          description="暂无文章"
          style={{ marginTop: '50px' }}
        />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={articles}
          renderItem={(article) => (
            <List.Item>
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Space>
                    <EyeOutlined />
                    <Text>{article.viewCount}</Text>
                  </Space>,
                  <Space>
                    <CalendarOutlined />
                    <Text>{formatDate(article.createdAt)}</Text>
                  </Space>
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar 
                      icon={<UserOutlined />} 
                      src={article.author?.avatar}
                    />
                  }
                  title={
                    <Link 
                      to={`/articles/${article.id}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {article.title}
                    </Link>
                  }
                  description={
                    <div>
                      <Paragraph 
                        ellipsis={{ rows: 3 }}
                        style={{ marginBottom: '8px' }}
                      >
                        {article.summary || article.content}
                      </Paragraph>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary">
                          作者: {article.author?.username}
                        </Text>
                        <Tag color={article.status === 'PUBLISHED' ? 'green' : 'orange'}>
                          {article.status === 'PUBLISHED' ? '已发布' : '草稿'}
                        </Tag>
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default HomePage;
