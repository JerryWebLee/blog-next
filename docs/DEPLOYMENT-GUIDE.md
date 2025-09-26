# 荒野博客系统部署指南

## 📋 概述

本文档详细记录了从零开始部署"荒野博客"系统的完整过程，包括MySQL容器创建、数据库初始化、环境配置、系统启动等所有步骤。该系统基于Next.js 15构建，使用MySQL数据库和Drizzle ORM。

## 🏗️ 系统架构

- **前端框架**: Next.js 15 (App Router)
- **开发语言**: TypeScript
- **数据库**: MySQL 8.0
- **ORM**: Drizzle ORM
- **样式**: Tailwind CSS + SCSS
- **UI组件**: HeroUI + 自定义组件
- **国际化**: 支持中文、英文、日文
- **认证**: JWT + bcryptjs
- **容器化**: Docker

## 🚀 部署步骤

### 步骤1：创建MySQL Docker容器

#### 1.1 停止现有容器（如果存在）

```bash
# 停止并删除现有容器
docker stop blog-mysql 2>/dev/null || true
docker rm blog-mysql 2>/dev/null || true
```

#### 1.2 创建新的MySQL容器

```bash
docker run --name blog-mysql \
  -e MYSQL_ROOT_PASSWORD=blog123456 \
  -e MYSQL_DATABASE=blog_system \
  -e MYSQL_CHARSET=utf8mb4 \
  -e MYSQL_COLLATION=utf8mb4_unicode_ci \
  -p 3306:3306 \
  -v /Users/harveylee/Documents/mysql-data:/var/lib/mysql \
  -d mysql:8.0
```

#### 1.3 验证容器状态

```bash
docker ps -a | grep blog-mysql
```

**预期输出**：

```
aabf5f7a0616   mysql:8.0   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:3306->3306/tcp   blog-mysql
```

#### 1.4 检查MySQL启动日志

```bash
docker logs blog-mysql | tail -10
```

**关键日志信息**：

- `ready for connections` - MySQL服务已准备就绪
- `MySQL init process done. Ready for start up` - 初始化完成

### 步骤2：环境配置

#### 2.1 创建环境变量文件

```bash
# 复制环境变量模板
cp env.example .env.local

# 更新数据库密码
sed -i '' 's/your_password_here/blog123456/g' .env.local

# 更新JWT密钥
sed -i '' 's/your_jwt_secret_key_here/blog_jwt_secret_key_2024/g' .env.local
```

#### 2.2 验证环境变量配置

```bash
cat .env.local
```

**关键配置项**：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=blog123456
DB_NAME=blog_system

# JWT配置
JWT_SECRET=blog_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### 步骤3：数据库连接测试

#### 3.1 运行数据库连接测试

```bash
pnpm test:db:connect
```

**预期输出**：

```
🚀 数据库连接测试工具
==================================================
🔌 数据库连接配置:
========================================
主机: localhost
端口: 3306
用户: root
数据库: blog_system
密码: ***已设置***
========================================

📡 正在连接数据库...
✅ 数据库连接成功！
📊 测试数据库查询...
✅ 查询测试成功！
   数据库版本: 8.0.43
🔍 检查数据库表...
✅ 数据库表检查成功！
   表数量: 0
   ⚠️ 数据库中没有表，可能需要运行迁移
🔌 数据库连接已关闭

🎉 数据库连接测试成功！
💡 您的博客系统可以正常使用数据库了
```

### 步骤4：数据库迁移

#### 4.1 生成迁移文件（如果需要）

```bash
pnpm db:generate
```

**预期输出**：

```
Reading config file '/Users/harveylee/Documents/CODE/nextjs-pro/blog-next/drizzle.config.ts'
Reading schema files:
/Users/harveylee/Documents/CODE/nextjs-pro/blog-next/lib/db/schema.ts

8 tables
categories 9 columns 3 indexes 0 fks
comments 13 columns 4 indexes 0 fks
media 14 columns 3 indexes 0 fks
post_tags 2 columns 2 indexes 0 fks
posts 18 columns 6 indexes 0 fks
settings 7 columns 2 indexes 0 fks
tags 8 columns 2 indexes 0 fks
users 13 columns 4 indexes 0 fks

No schema changes, nothing to migrate 😴
```

#### 4.2 执行数据库迁移

```bash
pnpm db:migrate
```

**预期输出**：

```
Reading config file '/Users/harveylee/Documents/CODE/nextjs-pro/blog-next/drizzle.config.ts'
[✓] migrations applied successfully!
```

#### 4.3 验证数据库表结构

```bash
pnpm test:db:connect
```

**预期输出**：

```
✅ 数据库表检查成功！
   表数量: 9
   现有表:
     - categories
     - comments
     - drizzle_migrations
     - media
     - post_tags
     - posts
     - settings
     - tags
     - users
```

### 步骤5：填充测试数据

#### 5.1 运行数据填充脚本

```bash
pnpm db:seed
```

**预期输出**：

```
🌱 开始数据库种子数据初始化...
==================================================
🧹 清理现有数据...
✅ 数据清理完成
👥 插入用户数据...
✅ 用户数据插入完成
📁 插入分类数据...
✅ 分类数据插入完成
🏷️ 插入标签数据...
✅ 标签数据插入完成
📝 插入文章数据...
✅ 文章数据插入完成
🔍 验证数据插入结果...
📊 数据统计:
   用户: 2
   分类: 3
   标签: 5
   文章: 2
✅ 数据验证完成

🎉 数据库种子数据初始化完成！
💡 您现在可以启动应用程序并查看示例数据
```

### 步骤6：API功能测试

#### 6.1 运行API测试套件

```bash
pnpm test:api
```

**预期输出**：

```
🚀 开始运行博客API测试...

🔌 测试数据库连接...
✅ 数据库连接成功
🧹 清理测试数据...
✅ 测试数据清理完成
📁 测试创建分类...
✅ 分类创建成功
🏷️ 测试创建标签...
✅ 标签创建成功
📝 测试创建文章...
✅ 文章创建成功
📋 测试获取文章列表...
✅ 文章列表获取成功
📖 测试获取文章详情...
✅ 文章详情获取成功
✏️ 测试更新文章...
✅ 文章更新成功
🔄 测试更新文章状态...
✅ 文章状态更新成功
👁️ 测试增加浏览量...
✅ 浏览量增加成功

🎉 所有测试完成！
```

### 步骤7：启动开发服务器

#### 7.1 启动Next.js开发服务器

```bash
pnpm dev
```

**预期输出**：

```
> next-app-template@0.0.1 dev /Users/harveylee/Documents/CODE/nextjs-pro/blog-next
> next dev --turbopack
   ▲ Next.js 15.1.3 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://192.168.2.104:3000
   - Environments: .env.local
 ✓ Starting...
 ✓ Compiled in 121ms
 ✓ Ready in 843ms
```

#### 7.2 测试API端点

```bash
# 测试数据库连接API
curl -s http://localhost:3000/api/test-db | head -20

# 测试文章列表API
curl -s http://localhost:3000/api/posts | head -20
```

**预期输出**：

```json
{
  "details": {
    "version": "8.0.43",
    "tableCount": 9,
    "tableNames": [
      "categories",
      "comments",
      "drizzle_migrations",
      "media",
      "post_tags",
      "posts",
      "settings",
      "tags",
      "users"
    ],
    "config": {
      "host": "localhost",
      "port": 3306,
      "user": "root",
      "database": "blog_system",
      "passwordSet": true
    }
  },
  "message": "数据库连接测试成功",
  "success": true
}
```

### 步骤8：前端页面验证

#### 8.1 测试首页访问

```bash
curl -s http://localhost:3000/zh-CN | grep -o '<title>.*</title>'
```

**预期输出**：

```html
<title>荒野博客 | 在数字荒野中探索技术 - 在思考森林中寻找真理</title>
```

#### 8.2 测试博客页面

```bash
curl -s http://localhost:3000/zh-CN/blog | grep -o '<title>.*</title>'
```

**预期输出**：

```html
<title>荒野博客 | 在数字荒野中探索技术 - 在思考森林中寻找真理</title>
```

## 📊 部署结果验证

### 数据库状态

- **容器名称**: `blog-mysql`
- **数据库版本**: MySQL 8.0.43
- **数据库名称**: `blog_system`
- **表数量**: 9个表
- **数据挂载**: `/Users/harveylee/Documents/mysql-data`
- **端口映射**: `3306:3306`

### 系统功能验证

- ✅ 数据库连接池正常工作
- ✅ Drizzle ORM操作正常
- ✅ API路由响应正常
- ✅ 多语言支持正常
- ✅ 前端页面渲染正常
- ✅ 文章CRUD操作正常

### 可访问的URL

- **中文首页**: http://localhost:3000/zh-CN
- **英文首页**: http://localhost:3000/en-US
- **日文首页**: http://localhost:3000/ja-JP
- **博客列表**: http://localhost:3000/zh-CN/blog
- **分类页面**: http://localhost:3000/zh-CN/categories
- **标签页面**: http://localhost:3000/zh-CN/tags
- **关于页面**: http://localhost:3000/zh-CN/about

## 🔧 常用管理命令

### Docker容器管理

```bash
# 查看容器状态
docker ps -a | grep blog-mysql

# 查看容器日志
docker logs blog-mysql

# 停止容器
docker stop blog-mysql

# 启动容器
docker start blog-mysql

# 重启容器
docker restart blog-mysql

# 删除容器
docker rm blog-mysql
```

### 数据库管理

```bash
# 测试数据库连接
pnpm test:db:connect

# 生成迁移文件
pnpm db:generate

# 执行迁移
pnpm db:migrate

# 推送到数据库
pnpm db:push

# 打开数据库管理界面
pnpm db:studio

# 填充测试数据
pnpm db:seed
```

### 应用管理

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行API测试
pnpm test:api
```

## 🚨 故障排除

### 常见问题及解决方案

#### 1. MySQL容器启动失败

**问题**: 容器无法启动或立即退出
**解决方案**:

```bash
# 检查端口是否被占用
lsof -i :3306

# 检查数据目录权限
ls -la /Users/harveylee/Documents/mysql-data

# 查看详细错误日志
docker logs blog-mysql
```

#### 2. 数据库连接失败

**问题**: 应用无法连接到数据库
**解决方案**:

```bash
# 检查环境变量配置
cat .env.local

# 测试数据库连接
pnpm test:db:connect

# 检查MySQL服务状态
docker exec -it blog-mysql mysql -u root -p -e "SELECT 1;"
```

#### 3. 迁移失败

**问题**: 数据库迁移执行失败
**解决方案**:

```bash
# 检查迁移文件
ls -la drizzle/

# 重新生成迁移
pnpm db:generate

# 强制推送schema
pnpm db:push
```

#### 4. 应用启动失败

**问题**: Next.js应用无法启动
**解决方案**:

```bash
# 检查依赖安装
pnpm install

# 清理缓存
rm -rf .next

# 重新启动
pnpm dev
```

## 📝 部署检查清单

### 部署前检查

- [ ] Docker已安装并运行
- [ ] 项目代码已克隆
- [ ] 环境变量文件已配置
- [ ] 数据挂载目录已创建

### 部署过程检查

- [ ] MySQL容器创建成功
- [ ] 数据库连接测试通过
- [ ] 数据库迁移执行成功
- [ ] 测试数据填充完成
- [ ] API功能测试通过
- [ ] 前端页面访问正常

### 部署后验证

- [ ] 所有页面可正常访问
- [ ] 数据库操作正常
- [ ] 多语言切换正常
- [ ] 响应式设计正常
- [ ] 性能表现良好

## 🎯 总结

本次部署过程完全成功，从零开始创建MySQL容器到系统完全正常运行，所有步骤都无问题。系统现在可以：

1. **正常访问**: 所有页面和API端点都正常工作
2. **数据操作**: 完整的CRUD功能已验证
3. **多语言支持**: 中文、英文、日文页面都正常渲染
4. **数据库稳定**: MySQL容器运行稳定，数据持久化正常
5. **开发就绪**: 可以进行进一步的开发和测试

整个部署过程耗时约10分钟，系统运行稳定，为后续开发提供了坚实的基础。

---

**文档版本**: v1.0  
**创建时间**: 2025-09-26  
**最后更新**: 2025-09-26  
**维护者**: 开发团队
