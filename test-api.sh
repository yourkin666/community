#!/bin/bash

# API测试脚本

BASE_URL="http://localhost:8080/api"

echo "==================================="
echo "交流社区 API 测试脚本"
echo "==================================="

# 检查后端服务是否启动
echo "🔍 检查后端服务状态..."
if ! curl -s "$BASE_URL/users/current" > /dev/null 2>&1; then
    echo "❌ 后端服务未启动，请先启动后端服务"
    echo "运行: cd backend && mvn spring-boot:run"
    exit 1
fi

echo "✅ 后端服务已启动"
echo ""

# 测试用户注册
echo "📝 测试用户注册..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/users/register" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testapi",
        "email": "testapi@example.com",
        "password": "123456",
        "bio": "API测试用户"
    }')

echo "注册响应: $REGISTER_RESPONSE"
echo ""

# 测试用户登录
echo "🔑 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/users/login" \
    -H "Content-Type: application/json" \
    -c cookies.txt \
    -d '{
        "username": "admin",
        "password": "123456"
    }')

echo "登录响应: $LOGIN_RESPONSE"
echo ""

# 测试获取当前用户信息
echo "👤 测试获取当前用户信息..."
USER_INFO=$(curl -s -X GET "$BASE_URL/users/current" \
    -b cookies.txt)

echo "用户信息: $USER_INFO"
echo ""

# 测试发布文章
echo "📄 测试发布文章..."
ARTICLE_RESPONSE=$(curl -s -X POST "$BASE_URL/articles" \
    -H "Content-Type: application/json" \
    -b cookies.txt \
    -d '{
        "title": "API测试文章",
        "content": "这是通过API测试脚本创建的文章内容。",
        "status": "PUBLISHED"
    }')

echo "文章发布响应: $ARTICLE_RESPONSE"
echo ""

# 测试获取文章列表
echo "📋 测试获取文章列表..."
ARTICLES_LIST=$(curl -s -X GET "$BASE_URL/articles")

echo "文章列表: $ARTICLES_LIST"
echo ""

# 清理临时文件
rm -f cookies.txt

echo "✅ API测试完成！"
