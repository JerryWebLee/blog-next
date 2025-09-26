# API 文档系统实现

## 概述

本项目实现了一个完整的API接口文档展示系统，能够自动扫描项目中的API路由并生成美观的文档页面。

## 功能特性

### 1. 自动API扫描

- 自动扫描 `app/api` 目录下的所有API路由
- 解析每个路由文件中的HTTP方法（GET、POST、PUT、DELETE等）
- 提取接口描述、参数、请求体、响应等信息
- 生成使用示例

### 2. 美观的文档界面

- 响应式设计，支持移动端和桌面端
- 支持明暗主题切换
- 多语言支持（中文、英文、日文）
- 可折叠的API组和接口详情
- 实时搜索和过滤功能

### 3. 详细的接口信息

- **参数列表**：显示路径参数、查询参数、请求头参数
- **请求体**：显示请求体类型、必需性、数据结构
- **响应信息**：显示状态码、响应描述、数据结构
- **使用示例**：提供cURL命令和请求/响应示例

## 文件结构

```
app/[lang]/api-docs/          # API文档页面
├── page.tsx                  # 主页面
└── loading.tsx               # 加载页面

components/api-docs/          # API文档组件
├── api-docs-client.tsx       # 客户端主组件
├── api-group-card.tsx        # API组卡片
├── api-endpoint-card.tsx     # 接口详情卡片
├── api-search-bar.tsx        # 搜索栏
├── api-filter-tabs.tsx       # 过滤标签
├── api-parameters.tsx        # 参数展示
├── api-request-body.tsx      # 请求体展示
├── api-responses.tsx         # 响应展示
└── api-examples.tsx          # 示例展示

app/api/api-docs/             # API数据接口
└── route.ts                  # 获取API数据的接口

lib/utils/api-scanner.ts      # API扫描器
```

## 使用方法

### 1. 访问API文档

在浏览器中访问：`http://localhost:3000/[lang]/api-docs`

其中 `[lang]` 可以是：

- `zh-CN` - 中文
- `en-US` - 英文
- `ja-JP` - 日文

### 2. 导航菜单

在网站导航栏中点击"API文档"链接即可访问。

### 3. 搜索和过滤

- 使用搜索框搜索特定的API接口
- 使用HTTP方法标签过滤接口（GET、POST、PUT、DELETE等）

### 4. 查看接口详情

- 点击API组卡片展开/折叠
- 点击具体接口查看详细信息
- 查看参数、请求体、响应和示例

## 技术实现

### 1. API扫描器 (ApiScanner)

```typescript
const scanner = new ApiScanner();
const apiGroups = await scanner.scanAllApis();
```

扫描器会：

- 递归扫描 `app/api` 目录
- 解析 `route.ts` 文件中的HTTP方法
- 提取注释中的描述信息
- 分析参数和响应结构
- 生成使用示例

### 2. 组件架构

- **服务端组件**：处理数据获取和国际化
- **客户端组件**：处理交互和状态管理
- **UI组件**：可复用的界面组件

### 3. 样式系统

- 使用 Tailwind CSS 进行样式设计
- 支持主题切换（明暗模式）
- 响应式布局设计

## 自定义配置

### 1. 添加新的API组描述

在 `api-scanner.ts` 中的 `getGroupDescription` 方法中添加：

```typescript
const descriptions: Record<string, string> = {
  "your-api-group": "你的API组描述",
  // ...
};
```

### 2. 自定义示例生成

在 `api-scanner.ts` 中的 `generateRequestBodyExample` 和 `generateResponseExample` 方法中添加特定API的示例。

### 3. 添加新的语言支持

在 `dictionaries/` 目录下添加新的语言文件，并在 `apiDocs` 部分添加翻译。

## 扩展功能

### 1. 接口测试

可以扩展组件以支持直接在文档页面测试API接口。

### 2. 接口版本管理

可以添加版本控制功能，支持多个API版本。

### 3. 接口权限说明

可以添加权限要求说明，显示哪些接口需要认证。

### 4. 接口使用统计

可以添加接口调用统计功能。

## 注意事项

1. **文件命名**：API路由文件必须命名为 `route.ts`
2. **注释规范**：建议在API文件中添加详细的JSDoc注释
3. **类型安全**：确保API参数和响应类型定义正确
4. **性能优化**：大量API接口时考虑分页加载

## 故障排除

### 1. API扫描失败

- 检查 `app/api` 目录结构
- 确保 `route.ts` 文件存在
- 检查文件权限

### 2. 样式问题

- 确保 Tailwind CSS 配置正确
- 检查主题变量定义

### 3. 国际化问题

- 检查字典文件格式
- 确保语言代码正确

## 更新日志

- **v1.0.0** - 初始版本，支持基本的API文档展示功能
- 支持自动API扫描
- 支持多语言界面
- 支持搜索和过滤
- 支持详细的接口信息展示
