/**
 * 标签页面
 * 展示所有博客标签，支持标签云、搜索、筛选和排序
 */

"use client";

import { useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Select, SelectItem, Spinner } from "@heroui/react";
import {
  BarChart3,
  Calendar,
  Filter,
  Hash,
  Palette,
  Search,
  SortAsc,
  SortDesc,
  Tag as TagIcon,
  TrendingUp,
} from "lucide-react";

import { TagCloud, TagStats } from "@/components/ui/tag-cloud";
import { mockTags } from "@/lib/data/mock-data";
import { Tag } from "@/types/blog";

/**
 * 标签卡片组件
 * 展示单个标签的信息和统计
 */
function TagCard({ tag }: { tag: Tag }) {
  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg hover:scale-105" isPressable>
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 标签颜色指示器 */}
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: tag.color || "#6b7280" }}
            />

            {/* 标签图标 */}
            <TagIcon className="w-5 h-5 text-primary" />

            {/* 标签信息 */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{tag.name}</h3>
              {tag.description && <p className="text-sm text-default-600 mt-1">{tag.description}</p>}
            </div>
          </div>

          {/* 文章数量 */}
          <Chip size="sm" variant="flat" color="primary" startContent={<Hash className="w-3 h-3" />}>
            {tag.postCount || 0}
          </Chip>
        </div>

        {/* 创建时间 */}
        <div className="flex items-center gap-1 mt-2 text-xs text-default-500">
          <Calendar className="w-3 h-3" />
          <span>创建于 {tag.createdAt.toLocaleDateString("zh-CN")}</span>
        </div>
      </CardBody>
    </Card>
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
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showOnlyActive: boolean;
  onToggleActive: (show: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}) {
  const sortOptions = [
    { key: "name", label: "按名称排序" },
    { key: "postCount", label: "按文章数量排序" },
    { key: "createdAt", label: "按创建时间排序" },
  ];

  return (
    <Card className="mb-6">
      <CardBody className="p-4">
        <div className="flex flex-col gap-4">
          {/* 搜索输入框 */}
          <Input
            placeholder="搜索标签..."
            value={searchQuery}
            onValueChange={onSearchChange}
            startContent={<Search className="w-4 h-4 text-default-400" />}
            className="w-full"
            variant="bordered"
          />

          {/* 筛选和排序选项 */}
          <div className="flex flex-col md:flex-row gap-4">
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

            {/* 排序选项 */}
            <div className="flex items-center gap-2 flex-1">
              <Select
                size="sm"
                placeholder="选择排序方式"
                selectedKeys={new Set([sortBy])}
                onSelectionChange={(keys) => onSortChange(Array.from(keys)[0] as string)}
                className="max-w-xs"
                variant="bordered"
              >
                {sortOptions.map((option) => (
                  <SelectItem key={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <Button
                size="sm"
                variant="bordered"
                isIconOnly
                onPress={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * 热门标签组件
 * 展示文章数量最多的标签
 */
function PopularTags({ tags }: { tags: Tag[] }) {
  const popularTags = tags
    .filter((tag) => tag.isActive)
    .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
    .slice(0, 10);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          热门标签
        </h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {popularTags.map((tag, index) => (
            <div key={tag.id} className="flex items-center gap-2 p-2 rounded-lg bg-default-100">
              <span className="text-sm font-bold text-primary">#{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tag.name}</p>
                <p className="text-xs text-default-500">{tag.postCount} 篇文章</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * 主标签页面组件
 */
export default function TagsPage() {
  // 状态管理
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [sortBy, setSortBy] = useState("postCount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);

  // 获取标签数据
  const tags = mockTags;

  // 搜索、筛选和排序逻辑
  const filteredAndSortedTags = useMemo(() => {
    let filtered = tags;

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tag) =>
          tag.name.toLowerCase().includes(query) ||
          tag.description?.toLowerCase().includes(query) ||
          tag.slug.toLowerCase().includes(query)
      );
    }

    // 按活跃状态筛选
    if (showOnlyActive) {
      filtered = filtered.filter((tag) => tag.isActive);
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "postCount":
          aValue = a.postCount || 0;
          bValue = b.postCount || 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.postCount || 0;
          bValue = b.postCount || 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tags, searchQuery, showOnlyActive, sortBy, sortOrder]);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 处理筛选切换
  const handleToggleActive = (show: boolean) => {
    setShowOnlyActive(show);
  };

  // 处理排序变化
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  // 处理排序顺序变化
  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">博客标签</h1>
        <p className="text-default-600">浏览所有标签，发现您感兴趣的技术话题</p>
      </div>

      {/* 统计信息 */}
      <TagStats tags={tags} />

      {/* 标签云 */}
      <TagCloud
        tags={tags.filter((tag) => tag.isActive)}
        maxTags={30}
        minSize={12}
        maxSize={20}
        showPostCount={true}
        onTagClick={(tag) => {
          // 可以在这里处理标签点击逻辑
          console.log("Clicked tag:", tag);
        }}
        layout="cloud"
        sortBy="postCount"
      />

      {/* 搜索和筛选 */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        showOnlyActive={showOnlyActive}
        onToggleActive={handleToggleActive}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
      />

      {/* 标签列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Spinner size="lg" color="primary" />
          </div>
        ) : filteredAndSortedTags.length > 0 ? (
          filteredAndSortedTags.map((tag) => <TagCard key={tag.id} tag={tag} />)
        ) : (
          <div className="col-span-full">
            <Card>
              <CardBody className="p-8 text-center">
                <TagIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">未找到标签</h3>
                <p className="text-default-600">
                  {searchQuery ? `没有找到包含 "${searchQuery}" 的标签` : "暂无标签数据"}
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
