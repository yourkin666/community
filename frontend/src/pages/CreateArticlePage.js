import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { articleService } from '../services/articleService';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateArticlePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 如果用户未登录，重定向到登录页
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await articleService.createArticle(values);
      if (response.success) {
        message.success('文章发布成功');
        navigate(`/articles/${response.data.id}`);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('发布文章失败');
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

  return (
    <div style={{ padding: '24px 0', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
          发布文章
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
                立即发布
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateArticlePage;
