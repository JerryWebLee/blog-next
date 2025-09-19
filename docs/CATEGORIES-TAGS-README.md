# 分类和标签页面UI组件

本文档介绍了博客系统中分类和标签页面的UI组件实现。

## 📁 文件结构

```
├── app/
│   ├── categories/
│   │   └── page.tsx              # 分类页面
│   ├── tags/
│   │   └── page.tsx              # 标签页面
│   └── categories-test/
│       └── page.tsx              # 测试页面
├── components/ui/
│   ├── category-tree.tsx         # 分类树组件
│   ├── tag-cloud.tsx            # 标签云组件
│   └── tag-color-picker.tsx     # 标签颜色选择器
├── lib/data/
│   └── mock-data.ts             # Mock数据
└── types/
    └── blog.ts                  # 类型定义
```

## 🎨 组件说明

### 1. 分类页面 (`/categories`)

**功能特性：**

- 📊 分类统计信息展示
- 🔍 搜索和筛选功能
- 🌳 层级分类树展示
- 📱 响应式设计

**主要组件：**

- `CategoryStats`: 显示分类统计信息
- `SearchAndFilter`: 搜索和筛选控件
- `CategoryTree`: 分类树组件

### 2. 标签页面 (`/tags`)

**功能特性：**

- 📊 标签统计信息展示
- ☁️ 标签云可视化
- 🔍 搜索、筛选和排序
- 🎨 颜色编码标签
- 📱 响应式设计

**主要组件：**

- `TagStats`: 显示标签统计信息
- `TagCloud`: 标签云组件
- `PopularTags`: 热门标签展示
- `SearchAndFilter`: 搜索和筛选控件

### 3. 自定义UI组件

#### CategoryTree 分类树组件

```tsx
<CategoryTree
  categories={categories}
  onCategorySelect={(category) => console.log(category)}
  selectedCategoryId={selectedId}
  showPostCount={true}
  showDescription={true}
/>
```

**Props:**

- `categories`: 分类数组
- `onCategorySelect`: 分类选择回调
- `selectedCategoryId`: 当前选中的分类ID
- `showPostCount`: 是否显示文章数量
- `showDescription`: 是否显示描述

#### TagCloud 标签云组件

```tsx
<TagCloud
  tags={tags}
  maxTags={50}
  minSize={12}
  maxSize={24}
  showPostCount={true}
  onTagClick={(tag) => console.log(tag)}
  selectedTagId={selectedId}
  layout="cloud"
  sortBy="postCount"
/>
```

**Props:**

- `tags`: 标签数组
- `maxTags`: 最大显示标签数量
- `minSize`: 最小字体大小
- `maxSize`: 最大字体大小
- `showPostCount`: 是否显示文章数量
- `onTagClick`: 标签点击回调
- `selectedTagId`: 当前选中的标签ID
- `layout`: 布局方式 ('cloud' | 'grid' | 'list')
- `sortBy`: 排序方式 ('name' | 'postCount' | 'random')

#### TagColorPicker 标签颜色选择器

```tsx
<TagColorPicker value={selectedColor} onChange={(color) => setSelectedColor(color)} disabled={false} />
```

**Props:**

- `value`: 当前选中的颜色值
- `onChange`: 颜色变化回调函数
- `disabled`: 是否禁用

## 🎯 技术特性

### 使用的技术栈

- **UI框架**: @heroui/react
- **图标库**: lucide-react
- **样式**: Tailwind CSS
- **类型安全**: TypeScript
- **状态管理**: React Hooks

### 设计特点

1. **响应式设计**: 支持移动端和桌面端
2. **主题支持**: 支持明暗主题切换
3. **无障碍访问**: 遵循WCAG指南
4. **性能优化**: 使用React.memo和useMemo优化
5. **类型安全**: 完整的TypeScript类型定义

### 交互功能

1. **搜索功能**: 实时搜索分类和标签
2. **筛选功能**: 按状态筛选内容
3. **排序功能**: 多种排序方式
4. **层级展示**: 分类的树形结构展示
5. **颜色编码**: 标签的颜色可视化

## 📊 Mock数据

系统提供了丰富的Mock数据用于开发和测试：

### 分类数据

- 6个顶级分类
- 多级分类结构
- 包含文章数量统计
- 支持描述信息

### 标签数据

- 20个技术标签
- 预设颜色编码
- 文章数量统计
- 支持描述信息

## 🚀 使用方法

### 1. 访问页面

- 分类页面: `/categories`
- 标签页面: `/tags`
- 测试页面: `/categories-test`

### 2. 集成组件

```tsx
import { CategoryTree } from "@/components/ui/category-tree";
import { TagCloud, TagStats } from "@/components/ui/tag-cloud";
import { TagColorPicker } from "@/components/ui/tag-color-picker";
```

### 3. 使用Mock数据

```tsx
import { mockCategories, mockTags } from "@/lib/data/mock-data";
```

## 🎨 自定义样式

组件支持通过Tailwind CSS类名进行样式自定义：

```tsx
<CategoryTree
  categories={categories}
  className="custom-category-tree"
  // ... 其他props
/>
```

## 📝 注释说明

所有组件都包含详细的中文注释，包括：

- 组件功能说明
- Props参数说明
- 使用示例
- 注意事项

## 🔧 开发建议

1. **性能优化**: 对于大量数据，建议使用虚拟滚动
2. **缓存策略**: 可以考虑添加数据缓存机制
3. **错误处理**: 添加适当的错误边界和加载状态
4. **测试覆盖**: 建议添加单元测试和集成测试

## 📱 响应式断点

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🎯 未来改进

1. 添加拖拽排序功能
2. 支持批量操作
3. 添加更多筛选选项
4. 优化移动端体验
5. 添加动画效果

---

**注意**: 这是一个演示实现，在生产环境中需要根据实际需求进行调整和优化。
