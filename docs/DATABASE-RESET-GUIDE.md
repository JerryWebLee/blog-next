# 数据库重置和验证指南

本指南将帮助您备份、清空并重新初始化数据库，以验证博客项目的完整流程。

## 准备工作

### 1. 环境检查

确保您的环境变量配置正确：

```bash
# 检查环境变量文件
cat .env.local
```

确保以下变量已正确设置：

- `DB_HOST` - 数据库主机
- `DB_PORT` - 数据库端口
- `DB_USER` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `DB_NAME` - 数据库名称

### 2. 数据库连接测试

```bash
# 测试数据库连接
pnpm test:db:connect
```

## 数据库重置流程

### 方法一：完整重置（推荐）

```bash
# 1. 备份数据库
pnpm db:backup

# 2. 重置数据库（清空 + 重新初始化）
pnpm db:reset

# 3. 验证数据库状态
pnpm test:db:connect
```

### 方法二：分步执行

```bash
# 1. 备份数据库
pnpm db:backup

# 2. 清空数据库
pnpm db:reset

# 3. 重新生成迁移文件
pnpm db:generate

# 4. 执行迁移
pnpm db:migrate

# 5. 填充种子数据
pnpm db:seed

# 6. 验证数据库
pnpm test:db:connect
```

## 验证流程

### 1. 启动应用程序

```bash
# 启动开发服务器
pnpm dev
```

### 2. 测试核心功能

#### 用户认证

- 访问 `/zh-CN/auth/register` 注册新用户
- 访问 `/zh-CN/auth/login` 登录用户
- 测试不同角色的权限

#### 文章管理

- 访问 `/zh-CN/blog` 查看文章列表
- 访问 `/zh-CN/blog/manage` 管理文章
- 创建、编辑、删除文章

#### 分类和标签

- 访问 `/zh-CN/categories` 查看分类
- 访问 `/zh-CN/tags` 查看标签
- 测试分类和标签的创建

#### 多语言支持

- 测试中文 (`/zh-CN/`)
- 测试英文 (`/en-US/`)
- 测试日文 (`/ja-JP/`)

### 3. API 测试

```bash
# 测试文章 API
pnpm test:api

# 测试标签 API
pnpm test:api:tags
```

## 故障排除

### 常见问题

#### 1. 数据库连接失败

```bash
# 检查 MySQL 服务是否运行
brew services list | grep mysql

# 启动 MySQL 服务
brew services start mysql
```

#### 2. 迁移失败

```bash
# 清理迁移文件并重新生成
rm -rf drizzle/
pnpm db:generate
pnpm db:migrate
```

#### 3. 种子数据失败

```bash
# 检查数据库表是否存在
pnpm test:db:connect

# 手动执行种子脚本
pnpm db:seed
```

### 日志查看

```bash
# 查看详细日志
pnpm db:reset 2>&1 | tee reset.log
```

## 备份和恢复

### 备份文件位置

备份文件保存在 `./.backups/` 目录中，文件名格式：

```
blog_system_backup_2024-01-01T12-00-00-000Z.json
```

### 恢复数据（如果需要）

```bash
# 查看备份文件
ls -la .backups/

# 手动恢复（需要编写恢复脚本）
# 目前备份文件为 JSON 格式，包含所有表的数据
```

## 验证清单

- [ ] 数据库连接正常
- [ ] 所有表创建成功
- [ ] 种子数据填充完成
- [ ] 用户注册/登录功能正常
- [ ] 文章 CRUD 操作正常
- [ ] 分类和标签功能正常
- [ ] 多语言切换正常
- [ ] API 接口响应正常
- [ ] 前端页面渲染正常

## 注意事项

1. **数据安全**：重置前请确保重要数据已备份
2. **环境隔离**：建议在开发环境进行测试
3. **权限检查**：确保数据库用户有足够的权限
4. **依赖检查**：确保所有依赖包已正确安装

## 相关命令

```bash
# 数据库相关
pnpm db:generate    # 生成迁移文件
pnpm db:migrate     # 执行迁移
pnpm db:push        # 推送 schema 到数据库
pnpm db:studio      # 打开数据库管理界面
pnpm db:seed        # 填充种子数据
pnpm db:backup      # 备份数据库
pnpm db:reset       # 重置数据库

# 测试相关
pnpm test:api       # 测试 API
pnpm test:db:connect # 测试数据库连接
pnpm test:db:env    # 测试环境变量
```

完成以上步骤后，您的博客系统应该已经重新初始化并可以正常使用了。
