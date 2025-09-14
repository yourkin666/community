#!/bin/bash

# 项目状态检查脚本

echo "==================================="
echo "交流社区项目状态检查"
echo "==================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 存在"
        return 0
    else
        echo -e "${RED}❌${NC} $1 不存在"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 目录存在"
        return 0
    else
        echo -e "${RED}❌${NC} $1 目录不存在"
        return 1
    fi
}

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✅${NC} $1 已安装"
        return 0
    else
        echo -e "${RED}❌${NC} $1 未安装"
        return 1
    fi
}

# 环境检查
echo "🔍 检查开发环境..."
check_command "java"
check_command "node"
check_command "npm"
check_command "mysql"
check_command "mvn"

echo ""

# 项目结构检查
echo "📁 检查项目结构..."

# 根目录文件
check_file "README.md"
check_file "DEVELOPMENT.md"
check_file "start.sh"
check_file "test-api.sh"
check_file "项目计划.md"

# 数据库文件
check_dir "database"
check_file "database/init.sql"

# 后端文件检查
echo ""
echo "🔧 检查后端文件..."
check_dir "backend"
check_file "backend/pom.xml"
check_file "backend/src/main/java/com/community/CommunityApplication.java"
check_file "backend/src/main/resources/application.yml"

# 后端核心类检查
backend_files=(
    "backend/src/main/java/com/community/config/WebConfig.java"
    "backend/src/main/java/com/community/controller/UserController.java"
    "backend/src/main/java/com/community/controller/ArticleController.java"
    "backend/src/main/java/com/community/service/UserService.java"
    "backend/src/main/java/com/community/service/ArticleService.java"
    "backend/src/main/java/com/community/mapper/UserMapper.java"
    "backend/src/main/java/com/community/mapper/ArticleMapper.java"
    "backend/src/main/java/com/community/entity/User.java"
    "backend/src/main/java/com/community/entity/Article.java"
    "backend/src/main/java/com/community/dto/ApiResponse.java"
    "backend/src/main/java/com/community/dto/LoginRequest.java"
    "backend/src/main/java/com/community/dto/RegisterRequest.java"
    "backend/src/main/java/com/community/utils/PasswordUtil.java"
    "backend/src/main/resources/mapper/UserMapper.xml"
    "backend/src/main/resources/mapper/ArticleMapper.xml"
)

for file in "${backend_files[@]}"; do
    check_file "$file"
done

# 前端文件检查
echo ""
echo "⚛️ 检查前端文件..."
check_dir "frontend"
check_file "frontend/package.json"
check_file "frontend/public/index.html"
check_file "frontend/src/index.js"
check_file "frontend/src/App.js"

# 前端核心文件检查
frontend_files=(
    "frontend/src/components/Header.js"
    "frontend/src/contexts/AuthContext.js"
    "frontend/src/services/api.js"
    "frontend/src/services/userService.js"
    "frontend/src/services/articleService.js"
    "frontend/src/pages/HomePage.js"
    "frontend/src/pages/LoginPage.js"
    "frontend/src/pages/RegisterPage.js"
    "frontend/src/pages/ArticleDetailPage.js"
    "frontend/src/pages/CreateArticlePage.js"
    "frontend/src/pages/EditArticlePage.js"
    "frontend/src/pages/ProfilePage.js"
    "frontend/src/styles/index.css"
    "frontend/src/styles/App.css"
)

for file in "${frontend_files[@]}"; do
    check_file "$file"
done

# 统计检查结果
echo ""
echo "📊 检查统计..."

total_files=$((${#backend_files[@]} + ${#frontend_files[@]} + 7)) # 7个根目录文件
existing_files=0

for file in "${backend_files[@]}" "${frontend_files[@]}" "README.md" "DEVELOPMENT.md" "start.sh" "test-api.sh" "项目计划.md" "database/init.sql" "backend/pom.xml"; do
    if [ -f "$file" ]; then
        ((existing_files++))
    fi
done

echo "总文件数: $total_files"
echo "存在文件数: $existing_files"
echo "完整度: $((existing_files * 100 / total_files))%"

# 检查权限
echo ""
echo "🔐 检查脚本权限..."
if [ -x "start.sh" ]; then
    echo -e "${GREEN}✅${NC} start.sh 有执行权限"
else
    echo -e "${YELLOW}⚠️${NC} start.sh 没有执行权限，正在修复..."
    chmod +x start.sh
fi

if [ -x "test-api.sh" ]; then
    echo -e "${GREEN}✅${NC} test-api.sh 有执行权限"
else
    echo -e "${YELLOW}⚠️${NC} test-api.sh 没有执行权限，正在修复..."
    chmod +x test-api.sh
fi

# 检查配置文件
echo ""
echo "⚙️ 检查配置文件..."

if [ -f "backend/src/main/resources/application.yml" ]; then
    if grep -q "localhost:3306" "backend/src/main/resources/application.yml"; then
        echo -e "${GREEN}✅${NC} 数据库配置正常"
    else
        echo -e "${YELLOW}⚠️${NC} 请检查数据库配置"
    fi
fi

if [ -f "frontend/package.json" ]; then
    if grep -q "proxy.*8080" "frontend/package.json"; then
        echo -e "${GREEN}✅${NC} 前端代理配置正常"
    else
        echo -e "${YELLOW}⚠️${NC} 请检查前端代理配置"
    fi
fi

# 提供建议
echo ""
echo "💡 使用建议..."
echo "1. 运行 './start.sh' 启动项目"
echo "2. 运行 './test-api.sh' 测试API"
echo "3. 查看 README.md 了解项目详情"
echo "4. 查看 DEVELOPMENT.md 了解开发指南"

echo ""
echo "==================================="
echo "项目检查完成！"
echo "==================================="