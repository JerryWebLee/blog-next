"use client";

import { useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Filter, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BlogFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedSort("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedStatus || selectedSort !== "newest";

  const categories = [
    { label: "全部", key: "all" },
    { label: "技术分享", key: "tech" },
    { label: "前端开发", key: "frontend" },
    { label: "后端开发", key: "backend" },
    { label: "数据库", key: "database" },
    { label: "DevOps", key: "devops" },
  ];

  const statuses = [
    { label: "全部", key: "all" },
    { label: "已发布", key: "published" },
    { label: "草稿", key: "draft" },
    { label: "已归档", key: "archived" },
  ];

  const sortOptions = [
    { label: "最新发布", key: "newest" },
    { label: "最早发布", key: "oldest" },
    { label: "最多浏览", key: "most-viewed" },
    { label: "最多点赞", key: "most-liked" },
    { label: "标题排序", key: "title" },
  ];

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>筛选文章</span>
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            清除筛选
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 搜索 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">搜索</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索文章标题或内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">分类</label>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="max-w-xs"
            items={categories}
            label="分类"
            placeholder="选择分类"
          >
            {(category: any) => <SelectItem>{category.label}</SelectItem>}
          </Select>
        </div>

        {/* 状态筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">状态</label>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="max-w-xs"
            items={statuses}
            label="状态"
            placeholder="选择状态"
          >
            {(status: any) => <SelectItem>{status.label}</SelectItem>}
          </Select>
        </div>

        {/* 排序 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">排序</label>
          <Select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="max-w-xs"
            items={sortOptions}
            label="排序"
          >
            {(sort: any) => <SelectItem>{sort.label}</SelectItem>}
          </Select>
        </div>
      </div>

      {/* 应用筛选按钮 */}
      <div className="mt-4 flex justify-end">
        <Button className="px-6">应用筛选</Button>
      </div>
    </div>
  );
}
