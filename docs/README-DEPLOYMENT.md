# 荒野博客系统部署文档

## 📚 文档概览

本目录包含了荒野博客系统的完整部署文档和工具，帮助您从零开始部署和运行整个系统。

## 📖 文档列表

### 1. 部署指南

- **文件**: `DEPLOYMENT-GUIDE.md`
- **内容**: 详细的步骤指南，包含每个部署步骤的详细说明
- **适用**: 首次部署或需要了解详细过程的用户

### 2. 部署日志

- **文件**: `DEPLOYMENT-LOG.md`
- **内容**: 实际部署过程的详细日志记录
- **适用**: 了解实际部署过程中可能遇到的问题和解决方案

## 🛠️ 部署工具

### 1. 快速部署脚本

- **文件**: `../scripts/deploy-from-scratch.sh`
- **功能**: 一键从零开始部署整个系统
- **使用**: `./scripts/deploy-from-scratch.sh`

### 2. 状态检查脚本

- **文件**: `../scripts/check-deployment-status.sh`
- **功能**: 检查系统部署状态和运行情况
- **使用**: `./scripts/check-deployment-status.sh`

## 🚀 快速开始

### 方法一：使用部署脚本（推荐）

```bash
# 一键部署
./scripts/deploy-from-scratch.sh

# 检查状态
./scripts/check-deployment-status.sh
```

### 方法二：手动部署

```bash
# 1. 创建MySQL容器
docker run --name blog-mysql \
  -e MYSQL_ROOT_PASSWORD=blog123456 \
  -e MYSQL_DATABASE=blog_system \
  -e MYSQL_CHARSET=utf8mb4 \
  -e MYSQL_COLLATION=utf8mb4_unicode_ci \
  -p 3306:3306 \
  -v /Users/harveylee/Documents/mysql-data:/var/lib/mysql \
  -d mysql:8.0

# 2. 配置环境变量
cp env.example .env.local
sed -i '' 's/your_password_here/blog123456/g' .env.local
sed -i '' 's/your_jwt_secret_key_here/blog_jwt_secret_key_2024/g' .env.local

# 3. 运行数据库迁移
pnpm db:migrate

# 4. 填充测试数据
pnpm db:seed

# 5. 启动开发服务器
pnpm dev
```

## 📊 系统要求

### 必需软件

- **Docker**: 用于运行MySQL容器
- **Node.js**: 版本 18+
- **pnpm**: 包管理器
- **MySQL**: 8.0+ (通过Docker)

### 系统资源

- **内存**: 最少 2GB RAM
- **磁盘**: 最少 1GB 可用空间
- **端口**: 3306 (MySQL), 3000 (Next.js)

## 🔧 常用命令

### Docker管理

```bash
# 查看容器状态
docker ps | grep blog-mysql

# 查看容器日志
docker logs blog-mysql

# 停止容器
docker stop blog-mysql

# 启动容器
docker start blog-mysql

# 重启容器
docker restart blog-mysql
```

### 数据库管理

```bash
# 测试连接
pnpm test:db:connect

# 生成迁移
pnpm db:generate

# 执行迁移
pnpm db:migrate

# 推送schema
pnpm db:push

# 打开管理界面
pnpm db:studio

# 填充数据
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

# 运行测试
pnpm test:api
```

## 🌐 访问地址

部署成功后，您可以通过以下地址访问系统：

- **中文首页**: http://localhost:3000/zh-CN
- **英文首页**: http://localhost:3000/en-US
- **日文首页**: http://localhost:3000/ja-JP
- **博客列表**: http://localhost:3000/zh-CN/blog
- **分类页面**: http://localhost:3000/zh-CN/categories
- **标签页面**: http://localhost:3000/zh-CN/tags
- **关于页面**: http://localhost:3000/zh-CN/about

## 🚨 故障排除

### 常见问题

#### 1. 容器启动失败

```bash
# 检查端口占用
lsof -i :3306

# 检查数据目录权限
ls -la /Users/harveylee/Documents/mysql-data

# 查看详细日志
docker logs blog-mysql
```

#### 2. 数据库连接失败

```bash
# 检查环境变量
cat .env.local

# 测试连接
pnpm test:db:connect

# 检查MySQL状态
docker exec -it blog-mysql mysql -u root -p -e "SELECT 1;"
```

#### 3. 应用启动失败

```bash
# 检查依赖
pnpm install

# 清理缓存
rm -rf .next

# 重新启动
pnpm dev
```

## 📝 部署检查清单

### 部署前

- [ ] Docker已安装并运行
- [ ] Node.js 18+ 已安装
- [ ] pnpm已安装
- [ ] 项目代码已克隆
- [ ] 数据目录已创建

### 部署中

- [ ] MySQL容器创建成功
- [ ] 环境变量配置正确
- [ ] 数据库连接测试通过
- [ ] 数据库迁移执行成功
- [ ] 测试数据填充完成
- [ ] API功能测试通过

### 部署后

- [ ] 所有页面可正常访问
- [ ] 数据库操作正常
- [ ] 多语言切换正常
- [ ] 响应式设计正常
- [ ] 性能表现良好

## 📞 技术支持

如果您在部署过程中遇到问题，请：

1. 查看详细的部署日志：`docs/DEPLOYMENT-LOG.md`
2. 运行状态检查脚本：`./scripts/check-deployment-status.sh`
3. 检查常见问题解决方案
4. 联系开发团队

## 📄 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](../LICENSE) 文件。

---

**文档版本**: v1.0  
**最后更新**: 2025-09-26  
**维护者**: 开发团队
