/**
 * 分类页面
 * 展示所有博客分类，支持搜索、筛选和层级展示
 */

"use client";

import { useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Spinner } from "@heroui/react";
import { Calendar, ChevronRight, FileText, Filter, Folder, FolderOpen, Hash, Search } from "lucide-react";

import { CategoryTree } from "@/components/ui/category-tree";
import { mockCategories } from "@/lib/data/mock-data";
import { Category } from "@/types/blog";

/**
 * 分类卡片组件
 * 展示单个分类的信息和统计
 */
function CategoryCard({ category, level = 0 }: { category: Category; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <Card
      className={`w-full transition-all duration-200 hover:shadow-lg ${
        level > 0 ? "ml-4 border-l-2 border-primary/20" : ""
      }`}
      isPressable
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 分类图标 */}
            <div className="flex items-center gap-2">
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="w-5 h-5 text-primary" />
                ) : (
                  <Folder className="w-5 h-5 text-primary" />
                )
              ) : (
                <FileText className="w-5 h-5 text-secondary" />
              )}

              {/* 层级缩进指示器 */}
              {level > 0 && <ChevronRight className="w-4 h-4 text-default-400" />}
            </div>

            {/* 分类信息 */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
              {category.description && <p className="text-sm text-default-600 mt-1">{category.description}</p>}
            </div>
          </div>

          {/* 统计信息和操作按钮 */}
          <div className="flex items-center gap-3">
            {/* 文章数量 */}
            <Chip size="sm" variant="flat" color="primary" startContent={<Hash className="w-3 h-3" />}>
              {category.postCount || 0}
            </Chip>

            {/* 展开/收起按钮 */}
            {hasChildren && (
              <div
                className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-default-100 rounded-sm transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </div>
            )}
          </div>
        </div>

        {/* 创建时间 */}
        <div className="flex items-center gap-1 mt-2 text-xs text-default-500">
          <Calendar className="w-3 h-3" />
          <span>创建于 {category.createdAt.toLocaleDateString("zh-CN")}</span>
        </div>
      </CardBody>

      {/* 子分类列表 */}
      {hasChildren && isExpanded && (
        <div className="px-4 pb-4">
          <Divider className="mb-3" />
          <div className="space-y-2">
            {category.children?.map((child) => (
              <CategoryCard key={child.id} category={child} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * 分类统计组件
 * 展示分类的总体统计信息
 */
function CategoryStats({ categories }: { categories: Category[] }) {
  const totalCategories = categories.length;
  const totalPosts = categories.reduce((sum, cat) => sum + (cat.postCount || 0), 0);
  const activeCategories = categories.filter((cat) => cat.isActive).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">总分类数</p>
              <p className="text-2xl font-bold">{totalCategories}</p>
            </div>
            <Folder className="w-8 h-8 text-blue-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">总文章数</p>
              <p className="text-2xl font-bold">{totalPosts}</p>
            </div>
            <FileText className="w-8 h-8 text-green-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">活跃分类</p>
              <p className="text-2xl font-bold">{activeCategories}</p>
            </div>
            <Filter className="w-8 h-8 text-purple-200" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/**
 * 搜索和筛选组件
 */
function SearchAndFilter({
  searchQuery,
  onSearchChange,
  showOnlyActive,
  onToggleActive,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showOnlyActive: boolean;
  onToggleActive: (show: boolean) => void;
}) {
  return (
    <Card className="mb-6">
      <CardBody className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索输入框 */}
          <Input
            placeholder="搜索分类..."
            value={searchQuery}
            onValueChange={onSearchChange}
            startContent={<Search className="w-4 h-4 text-default-400" />}
            className="flex-1"
            variant="bordered"
          />

          {/* 筛选选项 */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={showOnlyActive ? "solid" : "bordered"}
              color={showOnlyActive ? "primary" : "default"}
              onPress={() => onToggleActive(!showOnlyActive)}
              startContent={<Filter className="w-4 h-4" />}
            >
              仅显示活跃
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * 主分类页面组件
 */
export default function CategoriesPage() {
  // 状态管理
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 获取分类数据
  const categories = mockCategories;

  // 搜索和筛选逻辑
  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          category.description?.toLowerCase().includes(query) ||
          category.slug.toLowerCase().includes(query)
      );
    }

    // 按活跃状态筛选
    if (showOnlyActive) {
      filtered = filtered.filter((category) => category.isActive);
    }

    return filtered;
  }, [categories, searchQuery, showOnlyActive]);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 处理筛选切换
  const handleToggleActive = (show: boolean) => {
    setShowOnlyActive(show);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">博客分类</h1>
        <p className="text-default-600">探索我们的技术分类，找到您感兴趣的内容</p>
      </div>

      {/* 统计信息 */}
      <CategoryStats categories={categories} />

      {/* 搜索和筛选 */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        showOnlyActive={showOnlyActive}
        onToggleActive={handleToggleActive}
      />

      {/* 分类列表 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" color="primary" />
          </div>
        ) : filteredCategories.length > 0 ? (
          <CategoryTree
            categories={filteredCategories}
            onCategorySelect={(category) => {
              // 可以在这里处理分类选择逻辑
              console.log("Selected category:", category);
            }}
            showPostCount={true}
            showDescription={true}
          />
        ) : (
          <Card>
            <CardBody className="p-8 text-center">
              <Folder className="w-12 h-12 text-default-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">未找到分类</h3>
              <p className="text-default-600">
                {searchQuery ? `没有找到包含 "${searchQuery}" 的分类` : "暂无分类数据"}
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
