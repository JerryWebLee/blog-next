# 数据库初始化脚本使用说明

## 概述

`init-db.sql` 脚本用于初始化博客系统的数据库，包括：

- 创建数据库
- 创建用户并授予权限
- 创建所有必要的表
- 插入默认数据

## 使用方法

### 方法1：使用Docker（推荐）

```bash
# 确保MySQL容器正在运行
docker ps | grep mysql

# 执行初始化脚本
docker exec -i mysql-local mysql -u root -p < scripts/init-db.sql
```

### 方法2：直接使用MySQL客户端

```bash
# 连接到MySQL
mysql -u root -p

# 在MySQL中执行脚本
source scripts/init-db.sql;
```

## 脚本功能

### 1. 数据库创建

- 创建 `blog_system` 数据库
- 使用 `utf8mb4` 字符集和 `utf8mb4_unicode_ci` 排序规则

### 2. 用户管理

- 创建 `blog_user` 用户，密码为 `blog_password_123`
- 授予对 `blog_system` 数据库的完全权限
- 支持从任何主机连接（`%`）

### 3. 表结构

创建以下表：

- `users` - 用户表
- `categories` - 分类表
- `tags` - 标签表
- `posts` - 文章表
- `post_tags` - 文章标签关联表
- `comments` - 评论表
- `media` - 媒体文件表
- `settings` - 系统设置表

### 4. 默认数据

- 默认管理员用户（admin）
- 默认分类（技术、生活、随笔）
- 默认标签（JavaScript、React、Node.js等）
- 系统设置

## 验证安装

执行初始化脚本后，可以使用以下命令验证：

```bash
# 测试数据库连接
npm run test:db:connect

# 查看数据库表
docker exec -it mysql-local mysql -u blog_user -pblog_password_123 -e "USE blog_system; SHOW TABLES;"
```

## 注意事项

1. **安全性**：生产环境中请修改默认密码
2. **权限**：确保执行脚本的用户有创建用户和数据库的权限
3. **备份**：执行前建议备份现有数据
4. **环境变量**：确保 `.env.local` 文件中的数据库配置与脚本一致

## 故障排除

如果遇到权限问题：

```sql
-- 以root用户登录MySQL
mysql -u root -p

-- 手动创建用户和授权
CREATE USER 'blog_user'@'%' IDENTIFIED BY 'blog_password_123';
GRANT ALL PRIVILEGES ON blog_system.* TO 'blog_user'@'%';
FLUSH PRIVILEGES;
```
