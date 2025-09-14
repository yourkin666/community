#!/bin/bash

# 交流社区项目启动脚本

echo "==================================="
echo "交流社区项目启动脚本"
echo "==================================="

# 检查Java环境
if ! command -v java &> /dev/null; then
    echo "❌ Java未安装，请先安装JDK 11+"
    exit 1
fi

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js 16+"
    exit 1
fi

# 检查MySQL服务
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL未安装，请先安装MySQL 8.0+"
    exit 1
fi

echo "✅ 环境检查通过"

# 询问用户要启动什么
echo ""
echo "请选择要启动的服务："
echo "1) 只启动后端服务"
echo "2) 只启动前端服务"
echo "3) 同时启动前后端服务"
echo "4) 初始化数据库"
echo "5) 退出"

read -p "请输入选择 (1-5): " choice

case $choice in
    1)
        echo "🚀 启动后端服务..."
        cd backend
        mvn spring-boot:run
        ;;
    2)
        echo "🚀 启动前端服务..."
        cd frontend
        if [ ! -d "node_modules" ]; then
            echo "📦 安装前端依赖..."
            npm install
        fi
        npm start
        ;;
    3)
        echo "🚀 同时启动前后端服务..."
        
        # 启动后端（后台运行）
        echo "启动后端服务..."
        cd backend
        nohup mvn spring-boot:run > ../backend.log 2>&1 &
        BACKEND_PID=$!
        echo "后端服务PID: $BACKEND_PID"
        
        # 等待后端启动
        sleep 10
        
        # 启动前端
        echo "启动前端服务..."
        cd ../frontend
        if [ ! -d "node_modules" ]; then
            echo "📦 安装前端依赖..."
            npm install
        fi
        npm start
        ;;
    4)
        echo "🗄️ 初始化数据库..."
        echo "请确保MySQL服务已启动"
        read -p "MySQL root密码: " -s mysql_password
        echo ""
        
        mysql -u root -p$mysql_password -e "CREATE DATABASE IF NOT EXISTS community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        mysql -u root -p$mysql_password community < database/init.sql
        
        if [ $? -eq 0 ]; then
            echo "✅ 数据库初始化成功"
        else
            echo "❌ 数据库初始化失败"
        fi
        ;;
    5)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac
