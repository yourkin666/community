import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { articleService } from '../services/articleService';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;

const EditArticlePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchArticle();
  }, [id, isAuthenticated, navigate]);

  const fetchArticle = async () => {
    try {
      setPageLoading(true);
      const response = await articleService.getArticleById(id);
      if (response.success) {
        const articleData = response.data;
        
        // 检查是否是文章作者
        if (user && articleData.authorId !== user.id) {
          message.error('您没有权限编辑此文章');
          navigate('/');
          return;
        }
        
        setArticle(articleData);
        form.setFieldsValue({
          title: articleData.title,
          summary: articleData.summary,
          content: articleData.content,
        });
      } else {
        message.error('获取文章信息失败');
        navigate('/');
      }
    } catch (error) {
      message.error('获取文章信息失败');
      navigate('/');
    } finally {
      setPageLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await articleService.updateArticle(id, values);
      if (response.success) {
        message.success('文章更新成功');
        navigate(`/articles/${id}`);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('更新文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      values.status = 'DRAFT';
      await onFinish(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handlePublish = async () => {
    try {
      const values = await form.validateFields();
      values.status = 'PUBLISHED';
      await onFinish(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (pageLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Typography.Text>文章不存在</Typography.Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
          编辑文章
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="文章标题"
            name="title"
            rules={[
              { required: true, message: '请输入文章标题!' },
              { max: 200, message: '标题不能超过200个字符!' },
            ]}
          >
            <Input 
              placeholder="请输入文章标题" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="文章摘要"
            name="summary"
            extra="如果不填写，系统会自动生成摘要"
          >
            <TextArea 
              placeholder="请输入文章摘要（可选）" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label="文章内容"
            name="content"
            rules={[
              { required: true, message: '请输入文章内容!' },
            ]}
          >
            <TextArea 
              placeholder="请输入文章内容" 
              rows={15}
              style={{ fontSize: '16px', lineHeight: '1.6' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Button 
                size="large"
                icon={<SaveOutlined />}
                onClick={handleSaveDraft}
                loading={loading}
              >
                保存草稿
              </Button>
              <Button 
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={handlePublish}
                loading={loading}
              >
                {article.status === 'PUBLISHED' ? '更新发布' : '立即发布'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditArticlePage;
