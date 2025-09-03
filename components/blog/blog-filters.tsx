"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

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

  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    selectedStatus ||
    selectedSort !== "newest";

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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="tech">技术分享</SelectItem>
              <SelectItem value="frontend">前端开发</SelectItem>
              <SelectItem value="backend">后端开发</SelectItem>
              <SelectItem value="database">数据库</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 状态筛选 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">状态</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="archived">已归档</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 排序 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">排序</label>
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger>
              <SelectValue placeholder="选择排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">最新发布</SelectItem>
              <SelectItem value="oldest">最早发布</SelectItem>
              <SelectItem value="most-viewed">最多浏览</SelectItem>
              <SelectItem value="most-liked">最多点赞</SelectItem>
              <SelectItem value="title">标题排序</SelectItem>
            </SelectContent>
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
