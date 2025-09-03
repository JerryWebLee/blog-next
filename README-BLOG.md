# 博客系统开发文档

基于 Next.js 15 + HeroUI + MySQL + Drizzle ORM 构建的现代化博客系统。

## 🚀 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI组件库**: HeroUI v2
- **样式框架**: Tailwind CSS 4
- **数据库**: MySQL 8.0+
- **ORM**: Drizzle ORM
- **开发语言**: TypeScript
- **包管理器**: pnpm

## 📋 功能特性

### 核心功能

- ✅ 文章的增删改查 (CRUD)
- ✅ 分页查询和搜索
- ✅ 分类和标签管理
- ✅ 用户角色和权限
- ✅ 评论系统
- ✅ 媒体文件管理
- ✅ 系统设置

### 高级特性

- 🔒 用户认证和授权
- 📱 响应式设计
- 🔍 全文搜索
- 📊 数据统计
- 🎨 主题切换
- 📝 Markdown 支持
- 🖼️ 图片优化

## 🛠️ 安装和配置

### 1. 环境要求

- Node.js 18.17+
- MySQL 8.0+
- pnpm 8.0+

### 2. 克隆项目

```bash
git clone <repository-url>
cd blog-next
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 环境配置

复制环境变量示例文件：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，配置数据库连接信息：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=blog_system

# 应用配置
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. 数据库初始化

#### 方法一：使用SQL脚本（推荐）

```bash
# 登录MySQL
mysql -u root -p

# 执行初始化脚本
source scripts/init-db.sql
```

#### 方法二：使用Drizzle Kit

```bash
# 生成迁移文件
pnpm db:generate

# 推送到数据库
pnpm db:push

# 或者执行迁移
pnpm db:migrate
```

### 6. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看应用。

## 🗄️ 数据库设计

### 核心表结构

#### 用户表 (users)

- 用户基本信息
- 角色管理 (admin/author/user)
- 状态管理 (active/inactive/banned)

#### 文章表 (posts)

- 文章内容管理
- 状态控制 (draft/published/archived)
- 可见性设置 (public/private/password)
- 统计信息 (浏览次数、点赞数)

#### 分类表 (categories)

- 文章分类
- 支持层级结构
- 排序和状态管理

#### 标签表 (tags)

- 文章标签
- 颜色标识
- 关联统计

#### 评论表 (comments)

- 评论内容
- 嵌套评论支持
- 审核状态管理

#### 媒体文件表 (media)

- 文件上传管理
- 图片信息存储
- 访问权限控制

## 🔌 API 接口文档

### 文章管理

#### 获取文章列表

```http
GET /api/posts?page=1&limit=10&status=published&search=关键词
```

**查询参数:**

- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10, 最大: 100)
- `status`: 文章状态 (draft/published/archived)
- `visibility`: 可见性 (public/private/password)
- `authorId`: 作者ID
- `categoryId`: 分类ID
- `tagId`: 标签ID
- `search`: 搜索关键词
- `sortBy`: 排序字段
- `sortOrder`: 排序方向 (asc/desc)

**响应示例:**

```json
{
  "success": true,
  "message": "获取文章列表成功",
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### 获取文章详情

```http
GET /api/posts/{id}?includeRelations=true
```

**路径参数:**

- `id`: 文章ID

**查询参数:**

- `includeRelations`: 是否包含关联数据 (默认: true)

#### 创建文章

```http
POST /api/posts
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容",
  "excerpt": "文章摘要",
  "categoryId": 1,
  "tagIds": [1, 2, 3],
  "status": "draft",
  "visibility": "public"
}
```

#### 更新文章

```http
PUT /api/posts/{id}
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

#### 删除文章

```http
DELETE /api/posts/{id}
```

#### 部分更新文章

```http
PATCH /api/posts/{id}
Content-Type: application/json

{
  "status": "published",
  "visibility": "public"
}
```

### 响应格式

所有API都使用统一的响应格式：

```typescript
interface ApiResponse<T> {
  success: boolean; // 请求是否成功
  message: string; // 响应消息
  data?: T; // 响应数据
  error?: string; // 错误信息
  timestamp: string; // 响应时间戳
}
```

## 🏗️ 项目结构

```
blog-next/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   └── posts/         # 文章API
│   ├── blog/              # 博客页面
│   └── layout.tsx         # 根布局
├── components/             # 可复用组件
├── lib/                    # 工具库
│   ├── db/                # 数据库相关
│   │   ├── config.ts      # 数据库配置
│   │   └── schema.ts      # 数据库模式
│   ├── services/          # 业务服务层
│   │   └── post.service.ts # 文章服务
│   └── utils/             # 工具函数
├── types/                  # TypeScript类型定义
├── scripts/                # 脚本文件
│   └── init-db.sql        # 数据库初始化脚本
├── drizzle.config.ts       # Drizzle配置
└── env.example            # 环境变量示例
```

## 🔧 开发命令

```bash
# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 数据库相关
pnpm db:generate    # 生成迁移文件
pnpm db:migrate     # 执行迁移
pnpm db:push        # 推送到数据库
pnpm db:studio      # 打开数据库管理界面
pnpm db:seed        # 填充测试数据
```

## 🧪 测试API

### 使用curl测试

#### 创建文章

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试文章",
    "content": "这是一篇测试文章的内容，用于验证API功能。",
    "excerpt": "测试文章摘要",
    "status": "published"
  }'
```

#### 获取文章列表

```bash
curl "http://localhost:3000/api/posts?page=1&limit=5&status=published"
```

#### 获取文章详情

```bash
curl "http://localhost:3000/api/posts/1"
```

### 使用Postman测试

1. 导入API集合
2. 设置环境变量
3. 测试各个接口

## 🚨 注意事项

### 安全性

- 生产环境必须使用HTTPS
- 数据库密码要足够复杂
- 定期更新依赖包
- 实施适当的访问控制

### 性能优化

- 使用数据库索引
- 实施缓存策略
- 图片懒加载
- 分页查询优化

### 数据备份

- 定期备份数据库
- 备份上传的文件
- 测试恢复流程

## 🔮 后续开发计划

### 短期目标

- [ ] 用户认证系统
- [ ] 文件上传功能
- [ ] 评论管理
- [ ] 搜索优化

### 中期目标

- [ ] 多语言支持
- [ ] 主题系统
- [ ] 插件架构
- [ ] 移动端优化

### 长期目标

- [ ] 微服务架构
- [ ] 容器化部署
- [ ] 性能监控
- [ ] 自动化测试

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 参与讨论

---

**Happy Coding! 🎉**

