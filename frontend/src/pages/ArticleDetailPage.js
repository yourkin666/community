import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Avatar, Space, Tag, Button, Spin, message, Popconfirm } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { articleService } from '../services/articleService';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph, Text } = Typography;

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticleById(id);
      if (response.success) {
        setArticle(response.data);
      } else {
        message.error('获取文章详情失败');
        navigate('/');
      }
    } catch (error) {
      message.error('获取文章详情失败');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-article/${id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await articleService.deleteArticle(id);
      if (response.success) {
        message.success('文章删除成功');
        navigate('/');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('删除文章失败');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>文章不存在</Text>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user && user.id === article.authorId;

  return (
    <div style={{ padding: '24px 0', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>{article.title}</Title>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Space>
              <Avatar 
                icon={<UserOutlined />} 
                src={article.author?.avatar}
              />
              <Text strong>{article.author?.username}</Text>
              <Text type="secondary">•</Text>
              <Space size="small">
                <CalendarOutlined />
                <Text type="secondary">{formatDate(article.createdAt)}</Text>
              </Space>
              <Text type="secondary">•</Text>
              <Space size="small">
                <EyeOutlined />
                <Text type="secondary">{article.viewCount} 次浏览</Text>
              </Space>
            </Space>
            
            <Space>
              <Tag color={article.status === 'PUBLISHED' ? 'green' : 'orange'}>
                {article.status === 'PUBLISHED' ? '已发布' : '草稿'}
              </Tag>
              {isAuthor && (
                <>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={handleEdit}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定要删除这篇文章吗？"
                    description="删除后无法恢复"
                    onConfirm={handleDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </>
              )}
            </Space>
          </div>
        </div>

        <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
            {article.content}
          </Paragraph>
        </div>

        {article.author?.bio && (
          <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Title level={5}>关于作者</Title>
            <Text type="secondary">{article.author.bio}</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ArticleDetailPage;
