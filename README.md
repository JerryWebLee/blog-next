# 荒野博客 (Wilderness Blog)

> 在数字荒野中探索技术，在思考森林中寻找真理

一个基于 Next.js 15 构建的现代化多语言博客系统，提供完整的文章管理、用户认证、分类标签等功能。

## ✨ 功能特性

### 🌍 多语言支持
- 支持中文、英文、日文三种语言
- 基于 Next.js 15 的国际化路由
- 自动语言检测和切换
- 完整的翻译字典系统

### 🔐 用户认证系统
- JWT 身份验证
- 用户注册、登录、密码重置
- 基于角色的权限控制 (管理员、作者、普通用户)
- 安全的密码加密存储

### 📝 文章管理系统
- 完整的文章 CRUD 操作
- 支持草稿、发布、归档状态
- 富文本编辑器支持
- 文章浏览统计

### 🏷️ 分类和标签系统
- 层级分类结构
- 多对多标签关联
- 分类和标签管理界面
- 灵活的筛选和搜索

### 💬 评论系统
- 支持嵌套评论
- 评论管理功能
- 用户友好的交互界面

### 🎨 现代化 UI
- 基于 HeroUI 组件库
- 响应式设计，支持移动端
- 明暗主题切换
- 优雅的加载状态和动画效果

### 🚀 性能优化
- Next.js 15 App Router
- 服务端渲染 (SSR)
- 图片优化
- 代码分割和懒加载

## 🛠️ 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全开发

### 样式和 UI
- **Tailwind CSS** - 原子化 CSS 框架
- **HeroUI** - 现代化 UI 组件库
- **SCSS** - CSS 预处理器
- **Framer Motion** - 动画库

### 数据库和 ORM
- **MySQL** - 关系型数据库
- **Drizzle ORM** - 类型安全的 ORM

### 认证和安全
- **JWT** - JSON Web Token 认证
- **bcryptjs** - 密码加密
- **CSRF 保护** - 跨站请求伪造防护

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **pnpm** - 包管理器

## 📁 项目结构

```
blog-next/
├── app/                    # Next.js App Router 页面
│   ├── [lang]/            # 多语言路由
│   │   ├── about/         # 关于页面
│   │   ├── auth/          # 认证页面
│   │   ├── blog/          # 博客页面
│   │   └── categories/    # 分类页面
│   └── api/               # API 路由
├── components/            # React 组件
│   ├── blog/             # 博客相关组件
│   ├── layout/           # 布局组件
│   └── ui/               # UI 组件
├── lib/                  # 工具函数和配置
│   ├── db/               # 数据库配置
│   ├── contexts/         # React 上下文
│   └── utils/            # 工具函数
├── types/                # TypeScript 类型定义
├── dictionaries/         # 国际化字典
├── styles/               # 全局样式
└── public/               # 静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- pnpm 9.0 或更高版本
- MySQL 8.0 或更高版本

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd blog-next

# 安装依赖
pnpm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp env.example .env.local
```

2. 配置环境变量：
```env
# 数据库配置
DATABASE_URL="mysql://username:password@localhost:3306/blog_next"

# JWT 密钥
JWT_SECRET="your-jwt-secret-key"

# 应用配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### 数据库设置

```bash
# 生成数据库迁移文件
pnpm db:generate

# 执行数据库迁移
pnpm db:migrate

# 填充测试数据
pnpm db:seed
```

### 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 打开浏览器访问
open http://localhost:3000
```

## 📚 使用指南

### 多语言切换

项目支持三种语言：
- 中文 (zh-CN) - 默认语言
- 英文 (en-US)
- 日文 (ja-JP)

语言切换通过 URL 路径实现：
- `/zh-CN/` - 中文版本
- `/en-US/` - 英文版本
- `/ja-JP/` - 日文版本

### 用户角色权限

- **管理员 (admin)**: 全部权限，可以管理所有内容
- **作者 (author)**: 可以创建和管理自己的文章
- **普通用户 (user)**: 可以浏览和评论

### 文章管理

1. 登录后访问 `/blog/manage` 进入文章管理
2. 创建新文章：`/blog/manage/create`
3. 编辑文章：`/blog/manage/edit/[id]`
4. 管理标签：`/blog/manage/tags`

## 🛠️ 开发命令

```bash
# 开发
pnpm dev                 # 启动开发服务器
pnpm build              # 构建生产版本
pnpm start              # 启动生产服务器

# 代码质量
pnpm lint               # 代码检查
pnpm lint:fix           # 自动修复代码问题
pnpm format             # 代码格式化
pnpm format:check       # 检查代码格式

# 数据库
pnpm db:generate        # 生成迁移文件
pnpm db:migrate         # 执行迁移
pnpm db:push            # 推送到数据库
pnpm db:studio          # 打开数据库管理界面
pnpm db:seed            # 填充测试数据

# 测试
pnpm test:api           # 测试 API
pnpm test:db:connect    # 测试数据库连接
pnpm test:db:env        # 测试环境变量
```

## 🌐 API 文档

### 认证 API

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/forgot-password` - 忘记密码
- `POST /api/auth/reset-password` - 重置密码

### 文章 API

- `GET /api/posts` - 获取文章列表
- `POST /api/posts` - 创建文章
- `GET /api/posts/[id]` - 获取单篇文章
- `PUT /api/posts/[id]` - 更新文章
- `DELETE /api/posts/[id]` - 删除文章
- `POST /api/posts/[id]/view` - 记录文章浏览

### 标签 API

- `GET /api/tags` - 获取标签列表
- `POST /api/tags` - 创建标签
- `PUT /api/tags/[id]` - 更新标签
- `DELETE /api/tags/[id]` - 删除标签

## 🎨 主题定制

项目支持明暗主题切换，主题配置位于 `tailwind.config.mjs` 中。您可以通过修改 CSS 变量来自定义主题色彩。

## 📱 响应式设计

项目采用移动优先的响应式设计，支持各种屏幕尺寸：
- 移动设备 (< 768px)
- 平板设备 (768px - 1024px)
- 桌面设备 (> 1024px)

## 🔧 配置说明

### Next.js 配置

主要配置位于 `next.config.ts`：
- 图片域名白名单
- 国际化支持
- ESLint 配置

### 数据库配置

数据库配置位于 `lib/db/config.ts`，使用 Drizzle ORM 进行类型安全的数据库操作。

### 国际化配置

语言字典位于 `dictionaries/` 目录，支持动态加载和切换。

## �� 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## �� 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [HeroUI](https://heroui.com/) - 现代化 UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [Drizzle ORM](https://orm.drizzle.team/) - 类型安全的 ORM

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目 Issues: [GitHub Issues](https://github.com/your-username/blog-next/issues)
- 邮箱: your-email@example.com

---

**荒野博客** - 在数字荒野中探索技术，在思考森林中寻找真理 🌲
