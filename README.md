# 交流社区全栈项目

一个基于 React + Spring Boot + MyBatis + MySQL 的简洁现代化交流社区平台。

## 📋 项目概述

**项目名称**: 交流社区平台  
**技术栈**: React + Spring Boot + MyBatis + MySQL  
**项目类型**: 全栈Web应用  

## 🎯 功能特性

### 用户系统
- ✅ 用户注册/登录/登出（基于HttpSession）
- ✅ 用户资料管理（头像、简介）
- ✅ 用户认证和权限控制

### 文章系统
- ✅ 文章发布、编辑、删除
- ✅ 文章状态管理（草稿、发布）
- ✅ 文章列表展示和详情查看
- ✅ 文章浏览次数统计
- ✅ 自动生成文章摘要

### 界面设计
- ✅ 响应式设计，支持多设备访问
- ✅ 简洁现代的UI风格
- ✅ 基于Ant Design组件库
- ✅ 良好的用户体验和交互

## 🏗️ 技术架构

### 后端技术栈
- **Spring Boot 2.7+** - 主框架
- **MyBatis** - 数据库操作
- **MySQL 8.0** - 主数据库
- **Maven** - 依赖管理
- **HttpSession** - 会话管理

### 前端技术栈
- **React 18+** - 主框架
- **React Router** - 路由管理
- **Axios** - HTTP请求
- **Ant Design** - UI组件库
- **CSS3** - 样式管理

## 📁 项目结构

```
community/
├── database/                       # 数据库脚本
│   └── init.sql                   # 初始化SQL脚本
├── backend/                        # Spring Boot后端
│   ├── pom.xml                    # Maven配置
│   └── src/
│       └── main/
│           ├── java/com/community/
│           │   ├── CommunityApplication.java    # 启动类
│           │   ├── config/                      # 配置类
│           │   ├── controller/                  # 控制器
│           │   ├── service/                     # 业务逻辑
│           │   ├── mapper/                      # MyBatis映射
│           │   ├── entity/                      # 实体类
│           │   ├── dto/                         # 数据传输对象
│           │   └── utils/                       # 工具类
│           └── resources/
│               ├── application.yml              # 应用配置
│               └── mapper/                      # MyBatis XML文件
├── frontend/                       # React前端
│   ├── package.json               # 依赖配置
│   ├── public/                    # 静态资源
│   └── src/
│       ├── components/            # 组件
│       ├── pages/                 # 页面
│       ├── services/              # API服务
│       ├── contexts/              # React Context
│       └── styles/                # 样式文件
└── README.md                       # 项目说明
```

## 🚀 快速开始

### 环境要求
- **Java**: JDK 11+
- **Node.js**: 16+
- **MySQL**: 8.0+
- **Maven**: 3.6+

### 1. 数据库准备

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE community;

# 执行初始化脚本
USE community;
source database/init.sql;
```

### 2. 后端启动

```bash
cd backend

# 修改数据库配置（如需要）
# 编辑 src/main/resources/application.yml

# 启动后端服务
mvn spring-boot:run

# 或者在IDE中直接运行 CommunityApplication.java
```

后端服务将在 `http://localhost:8080/api` 启动

### 3. 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动前端开发服务器
npm start
```

前端应用将在 `http://localhost:3000` 启动

### 4. 访问应用

打开浏览器访问 `http://localhost:3000`

默认测试账号：
- 用户名: `admin` / 密码: `123456`
- 用户名: `testuser` / 密码: `123456`

## 📊 数据库设计

### 用户表 (users)
- `id` - 主键
- `username` - 用户名（唯一）
- `email` - 邮箱（唯一）
- `password` - 密码（MD5加密）
- `avatar` - 头像URL
- `bio` - 个人简介
- `created_at` - 创建时间
- `updated_at` - 更新时间

### 文章表 (articles)
- `id` - 主键
- `title` - 文章标题
- `content` - 文章内容
- `summary` - 文章摘要
- `author_id` - 作者ID（外键）
- `status` - 文章状态（DRAFT/PUBLISHED）
- `view_count` - 浏览次数
- `created_at` - 创建时间
- `updated_at` - 更新时间

## 🔧 开发说明

### API接口

#### 用户相关
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `POST /api/users/logout` - 用户登出
- `GET /api/users/current` - 获取当前用户信息
- `PUT /api/users/profile` - 更新用户资料

#### 文章相关
- `GET /api/articles` - 获取已发布文章列表
- `GET /api/articles/{id}` - 获取文章详情
- `GET /api/articles/my` - 获取当前用户文章
- `POST /api/articles` - 发布文章
- `PUT /api/articles/{id}` - 更新文章
- `DELETE /api/articles/{id}` - 删除文章

### 前端路由
- `/` - 首页（文章列表）
- `/login` - 登录页面
- `/register` - 注册页面
- `/articles/{id}` - 文章详情页
- `/create-article` - 发布文章页
- `/edit-article/{id}` - 编辑文章页
- `/profile` - 个人资料页

## 🔒 安全特性

- 用户密码MD5加密存储
- 基于HttpSession的会话管理
- MyBatis参数化查询防止SQL注入
- 前后端输入验证
- CORS跨域配置
- 用户权限控制

## 📝 开发规范

### 后端规范
- RESTful API设计
- 统一返回格式（ApiResponse）
- 异常处理机制
- 日志记录规范
- 代码注释规范

### 前端规范
- 组件化开发
- React Hooks使用
- 统一状态管理（Context）
- 响应式设计
- 错误边界处理

## 🎨 UI设计

- **简洁现代**: 采用简洁的设计风格，突出内容
- **响应式**: 支持桌面端和移动端访问
- **用户体验**: 注重交互体验和操作流畅性
- **一致性**: 保持设计元素的一致性

## 📈 后续扩展

可以考虑添加的功能：
- 文章评论系统
- 文章分类和标签
- 用户关注功能
- 文章搜索功能
- 文件上传功能
- 邮件通知功能
- 管理员后台

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

Community Team - 交流社区开发团队

---

**创建时间**: 2024年12月  
**最后更新**: 2024年12月  
**版本**: v1.0
