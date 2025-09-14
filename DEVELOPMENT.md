# 开发指南

## 📋 开发环境配置

### 必需软件
- **JDK 11+**: 后端开发
- **Node.js 16+**: 前端开发  
- **MySQL 8.0+**: 数据库
- **Maven 3.6+**: 后端依赖管理
- **Git**: 版本控制

### IDE推荐
- **后端**: IntelliJ IDEA / Eclipse
- **前端**: VS Code / WebStorm
- **数据库**: MySQL Workbench / Navicat

## 🚀 快速启动

### 1. 克隆项目
```bash
git clone <repository-url>
cd community
```

### 2. 数据库初始化
```bash
# 启动MySQL服务
sudo service mysql start

# 登录MySQL并创建数据库
mysql -u root -p
CREATE DATABASE community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE community;
source database/init.sql;
```

### 3. 后端启动
```bash
cd backend

# 修改数据库配置（如需要）
vim src/main/resources/application.yml

# 启动后端
mvn spring-boot:run
```

### 4. 前端启动
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 5. 使用启动脚本（推荐）
```bash
# 使用项目提供的启动脚本
./start.sh
```

## 🔧 开发配置

### 后端配置 (application.yml)
```yaml
# 开发环境配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/community?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 你的密码
    
# 生产环境需要修改的配置
server:
  port: 8080
  
logging:
  level:
    com.community: debug  # 开发时可以设置为debug
```

### 前端代理配置 (package.json)
```json
{
  "proxy": "http://localhost:8080"
}
```

## 📊 数据库管理

### 常用SQL命令
```sql
-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESCRIBE users;
DESCRIBE articles;

-- 查看数据
SELECT * FROM users;
SELECT * FROM articles;

-- 重置数据库
DROP DATABASE community;
CREATE DATABASE community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE community;
source database/init.sql;
```

### 测试数据
项目已包含测试用户：
- 用户名: `admin`, 密码: `123456`
- 用户名: `testuser`, 密码: `123456`

## 🧪 测试

### API测试
```bash
# 使用提供的测试脚本
./test-api.sh

# 或手动测试
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

### 前端测试
```bash
cd frontend
npm test
```

## 📝 开发规范

### 后端开发规范

#### 1. 代码结构
```
src/main/java/com/community/
├── config/          # 配置类
├── controller/      # 控制器层
├── service/         # 业务逻辑层
├── mapper/          # 数据访问层
├── entity/          # 实体类
├── dto/             # 数据传输对象
└── utils/           # 工具类
```

#### 2. 命名规范
- **类名**: 大驼峰命名法 (PascalCase)
- **方法名**: 小驼峰命名法 (camelCase)
- **常量**: 全大写下划线分隔 (UPPER_SNAKE_CASE)
- **包名**: 全小写

#### 3. 注释规范
```java
/**
 * 用户服务类
 * 
 * @author Community Team
 * @version 1.0
 */
@Service
public class UserService {
    
    /**
     * 用户登录
     * 
     * @param request 登录请求
     * @return 用户信息
     */
    public User login(LoginRequest request) {
        // 实现逻辑
    }
}
```

#### 4. 异常处理
```java
try {
    // 业务逻辑
} catch (Exception e) {
    log.error("操作失败", e);
    throw new RuntimeException("操作失败: " + e.getMessage());
}
```

### 前端开发规范

#### 1. 组件结构
```
src/
├── components/      # 可复用组件
├── pages/          # 页面组件
├── services/       # API服务
├── contexts/       # React Context
├── utils/          # 工具函数
└── styles/         # 样式文件
```

#### 2. 组件命名
- **组件文件**: PascalCase (如 `UserProfile.js`)
- **普通文件**: camelCase (如 `userService.js`)

#### 3. React Hooks使用
```javascript
// 推荐的Hook使用模式
const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // 副作用逻辑
  }, []);
  
  return <div>...</div>;
};
```

#### 4. API调用规范
```javascript
// 统一的错误处理
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await apiService.getData();
    if (response.success) {
      setData(response.data);
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error('操作失败，请重试');
  } finally {
    setLoading(false);
  }
};
```

## 🔍 调试技巧

### 后端调试
1. **日志查看**
   ```bash
   # 查看应用日志
   tail -f backend.log
   ```

2. **数据库调试**
   ```yaml
   # application.yml 中启用SQL日志
   mybatis:
     configuration:
       log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
   ```

3. **断点调试**
   - 在IDE中设置断点
   - Debug模式启动应用

### 前端调试
1. **浏览器开发者工具**
   - Network标签查看API请求
   - Console查看错误信息
   - React DevTools查看组件状态

2. **代码调试**
   ```javascript
   console.log('调试信息:', data);
   debugger; // 设置断点
   ```

## 🚀 部署指南

### 开发环境部署
```bash
# 后端
cd backend
mvn spring-boot:run

# 前端
cd frontend
npm start
```

### 生产环境部署
```bash
# 后端打包
cd backend
mvn clean package

# 运行jar包
java -jar target/community-backend-1.0.0.jar

# 前端打包
cd frontend
npm run build

# 部署到nginx或其他web服务器
```

## 🔧 常见问题

### 1. 数据库连接失败
- 检查MySQL服务是否启动
- 确认数据库用户名密码正确
- 检查数据库是否存在

### 2. 前端无法访问后端API
- 确认后端服务已启动
- 检查CORS配置
- 确认代理配置正确

### 3. 会话失效问题
- 检查Session配置
- 确认Cookie设置正确
- 检查跨域配置

### 4. 编译错误
```bash
# 清理并重新编译
cd backend
mvn clean compile

cd frontend
rm -rf node_modules
npm install
```

## 📚 参考资源

### 技术文档
- [Spring Boot官方文档](https://spring.io/projects/spring-boot)
- [React官方文档](https://reactjs.org/)
- [MyBatis官方文档](https://mybatis.org/)
- [Ant Design组件库](https://ant.design/)

### 学习资源
- [Spring Boot教程](https://www.baeldung.com/spring-boot)
- [React Hooks指南](https://reactjs.org/docs/hooks-intro.html)
- [MySQL性能优化](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

## 🤝 贡献指南

### 提交代码
1. 创建功能分支
2. 编写代码和测试
3. 提交PR并描述变更
4. 代码审查通过后合并

### 代码审查要点
- 代码规范性
- 功能完整性
- 性能考虑
- 安全性检查

---

**最后更新**: 2024年12月  
**维护者**: Community Team