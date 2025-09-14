/**
 * 标签云组件
 * 以云状布局展示标签，支持不同大小和颜色
 */

"use client";

import { useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { BarChart3, Hash, Palette, Shuffle, Tag as TagIcon, TrendingUp } from "lucide-react";

import { Tag } from "@/types/blog";

interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
  minSize?: number;
  maxSize?: number;
  showPostCount?: boolean;
  onTagClick?: (tag: Tag) => void;
  selectedTagId?: number;
  layout?: "cloud" | "grid" | "list";
  sortBy?: "name" | "postCount" | "random";
}

/**
 * 标签云组件
 * @param tags 标签数组
 * @param maxTags 最大显示标签数量
 * @param minSize 最小字体大小
 * @param maxSize 最大字体大小
 * @param showPostCount 是否显示文章数量
 * @param onTagClick 标签点击回调
 * @param selectedTagId 当前选中的标签ID
 * @param layout 布局方式
 * @param sortBy 排序方式
 */
export function TagCloud({
  tags,
  maxTags = 50,
  minSize = 12,
  maxSize = 24,
  showPostCount = true,
  onTagClick,
  selectedTagId,
  layout = "cloud",
  sortBy = "postCount",
}: TagCloudProps) {
  const [shuffleKey, setShuffleKey] = useState(0);

  // 处理标签数据
  const processedTags = useMemo(() => {
    let processed = [...tags];

    // 按指定方式排序
    switch (sortBy) {
      case "name":
        processed.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "postCount":
        processed.sort((a, b) => (b.postCount || 0) - (a.postCount || 0));
        break;
      case "random":
        // 随机排序，使用shuffleKey来触发重新排序
        processed.sort(() => Math.random() - 0.5);
        break;
    }

    // 限制显示数量
    return processed.slice(0, maxTags);
  }, [tags, maxTags, sortBy, shuffleKey]);

  // 计算标签大小
  const getTagSize = (postCount: number) => {
    if (processedTags.length === 0) return minSize;

    const maxCount = Math.max(...processedTags.map((tag) => tag.postCount || 0));
    const minCount = Math.min(...processedTags.map((tag) => tag.postCount || 0));

    if (maxCount === minCount) return (minSize + maxSize) / 2;

    const ratio = (postCount - minCount) / (maxCount - minCount);
    return minSize + (maxSize - minSize) * ratio;
  };

  // 获取标签颜色
  const getTagColor = (tag: Tag) => {
    return tag.color || "#6b7280";
  };

  // 处理标签点击
  const handleTagClick = (tag: Tag) => {
    onTagClick?.(tag);
  };

  // 重新洗牌
  const handleShuffle = () => {
    setShuffleKey((prev) => prev + 1);
  };

  // 渲染标签
  const renderTag = (tag: Tag) => {
    const isSelected = selectedTagId === tag.id;
    const size = getTagSize(tag.postCount || 0);
    const color = getTagColor(tag);

    return (
      <Chip
        key={tag.id}
        size="sm"
        variant={isSelected ? "solid" : "flat"}
        color={isSelected ? "primary" : "default"}
        className={`
          cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md
          ${isSelected ? "ring-2 ring-primary" : ""}
        `}
        style={{
          fontSize: `${size}px`,
          backgroundColor: isSelected ? undefined : `${color}20`,
          borderColor: isSelected ? undefined : color,
          color: isSelected ? undefined : color,
        }}
        onClick={() => handleTagClick(tag)}
        startContent={showPostCount ? <Hash className="w-3 h-3" /> : undefined}
      >
        {tag.name}
        {showPostCount && <span className="ml-1 text-xs opacity-75">{tag.postCount || 0}</span>}
      </Chip>
    );
  };

  // 根据布局渲染
  const renderContent = () => {
    switch (layout) {
      case "grid":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">{processedTags.map(renderTag)}</div>
        );

      case "list":
        return <div className="space-y-2">{processedTags.map(renderTag)}</div>;

      case "cloud":
      default:
        return <div className="flex flex-wrap gap-2 justify-center">{processedTags.map(renderTag)}</div>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            标签云
          </h2>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="light" isIconOnly onPress={handleShuffle} title="重新洗牌">
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {processedTags.length > 0 ? (
          renderContent()
        ) : (
          <div className="text-center py-8">
            <TagIcon className="w-8 h-8 text-default-400 mx-auto mb-2" />
            <p className="text-sm text-default-600">暂无标签数据</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/**
 * 标签统计组件
 * 显示标签的统计信息
 */
export function TagStats({ tags }: { tags: Tag[] }) {
  const stats = useMemo(() => {
    const totalTags = tags.length;
    const totalPosts = tags.reduce((sum, tag) => sum + (tag.postCount || 0), 0);
    const activeTags = tags.filter((tag) => tag.isActive).length;
    const avgPostsPerTag = totalTags > 0 ? Math.round(totalPosts / totalTags) : 0;
    const mostUsedTag = tags.reduce(
      (max, tag) => ((tag.postCount || 0) > (max.postCount || 0) ? tag : max),
      tags[0] || { name: "无", postCount: 0 }
    );

    return {
      totalTags,
      totalPosts,
      activeTags,
      avgPostsPerTag,
      mostUsedTag,
    };
  }, [tags]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">总标签数</p>
              <p className="text-2xl font-bold">{stats.totalTags}</p>
            </div>
            <TagIcon className="w-8 h-8 text-blue-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">总文章数</p>
              <p className="text-2xl font-bold">{stats.totalPosts}</p>
            </div>
            <Hash className="w-8 h-8 text-green-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">活跃标签</p>
              <p className="text-2xl font-bold">{stats.activeTags}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">最热门</p>
              <p className="text-lg font-bold truncate">{stats.mostUsedTag.name}</p>
              <p className="text-xs text-orange-200">{stats.mostUsedTag.postCount} 篇</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-200" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
