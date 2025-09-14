/**
 * 分类树组件
 * 以树形结构展示分类层级关系
 */

"use client";

import { useState } from "react";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Calendar, ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Hash } from "lucide-react";

import { Category } from "@/types/blog";

interface CategoryTreeProps {
  categories: Category[];
  onCategorySelect?: (category: Category) => void;
  selectedCategoryId?: number;
  showPostCount?: boolean;
  showDescription?: boolean;
  level?: number;
}

/**
 * 分类树节点组件
 */
function CategoryTreeNode({
  category,
  onCategorySelect,
  selectedCategoryId,
  showPostCount = true,
  showDescription = true,
  level = 0,
}: {
  category: Category;
  onCategorySelect?: (category: Category) => void;
  selectedCategoryId?: number;
  showPostCount?: boolean;
  showDescription?: boolean;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // 默认展开前两级
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategoryId === category.id;

  return (
    <div className="w-full">
      {/* 分类节点 */}
      <Card
        className={`
          w-full transition-all duration-200 hover:shadow-md cursor-pointer
          ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}
          ${level > 0 ? "ml-4" : ""}
        `}
        isPressable
        onPress={() => {
          onCategorySelect?.(category);
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <CardBody className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* 展开/收起按钮 */}
              {hasChildren && (
                <div
                  className="min-w-6 w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-default-100 rounded-sm transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
              )}

              {/* 分类图标 */}
              <div className="flex items-center gap-2">
                {hasChildren ? (
                  isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-primary" />
                  ) : (
                    <Folder className="w-4 h-4 text-primary" />
                  )
                ) : (
                  <FileText className="w-4 h-4 text-secondary" />
                )}
              </div>

              {/* 分类信息 */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">{category.name}</h4>
                {showDescription && category.description && (
                  <p className="text-xs text-default-600 mt-1 line-clamp-2">{category.description}</p>
                )}
              </div>
            </div>

            {/* 统计信息 */}
            <div className="flex items-center gap-2">
              {showPostCount && (
                <Chip size="sm" variant="flat" color="primary" startContent={<Hash className="w-3 h-3" />}>
                  {category.postCount || 0}
                </Chip>
              )}
            </div>
          </div>

          {/* 创建时间 */}
          <div className="flex items-center gap-1 mt-2 text-xs text-default-500">
            <Calendar className="w-3 h-3" />
            <span>创建于 {category.createdAt.toLocaleDateString("zh-CN")}</span>
          </div>
        </CardBody>
      </Card>

      {/* 子分类 */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {category.children?.map((child) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              onCategorySelect={onCategorySelect}
              selectedCategoryId={selectedCategoryId}
              showPostCount={showPostCount}
              showDescription={showDescription}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 分类树组件
 * @param categories 分类数组
 * @param onCategorySelect 分类选择回调
 * @param selectedCategoryId 当前选中的分类ID
 * @param showPostCount 是否显示文章数量
 * @param showDescription 是否显示描述
 */
export function CategoryTree({
  categories,
  onCategorySelect,
  selectedCategoryId,
  showPostCount = true,
  showDescription = true,
}: CategoryTreeProps) {
  // 只显示顶级分类，子分类通过展开显示
  const topLevelCategories = categories.filter((category) => !category.parentId);

  return (
    <div className="space-y-2">
      {topLevelCategories.length > 0 ? (
        topLevelCategories.map((category) => (
          <CategoryTreeNode
            key={category.id}
            category={category}
            onCategorySelect={onCategorySelect}
            selectedCategoryId={selectedCategoryId}
            showPostCount={showPostCount}
            showDescription={showDescription}
          />
        ))
      ) : (
        <Card>
          <CardBody className="p-6 text-center">
            <Folder className="w-8 h-8 text-default-400 mx-auto mb-2" />
            <p className="text-sm text-default-600">暂无分类数据</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
