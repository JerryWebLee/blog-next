/**
 * 分类测试页面
 * 展示分类页面的所有功能
 */

"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { Palette, Tag as TagIcon } from "lucide-react";

import { CategoryTree } from "@/components/ui/category-tree";
import { TagCloud, TagStats } from "@/components/ui/tag-cloud";
import { TagColorPicker } from "@/components/ui/tag-color-picker";
import { mockCategories, mockTags } from "@/lib/data/mock-data";

export default function CategoriesTestPage() {
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">分类和标签组件测试页面</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 分类树组件测试 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">分类树组件</h2>
          </CardHeader>
          <CardBody>
            <CategoryTree
              categories={mockCategories}
              onCategorySelect={(category) => {
                setSelectedCategory(category);
                console.log("Selected category:", category);
              }}
              selectedCategoryId={selectedCategory?.id}
              showPostCount={true}
              showDescription={true}
            />
          </CardBody>
        </Card>

        {/* 标签云组件测试 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">标签云组件</h2>
          </CardHeader>
          <CardBody>
            <TagCloud
              tags={mockTags.slice(0, 20)}
              maxTags={20}
              minSize={10}
              maxSize={18}
              showPostCount={true}
              onTagClick={(tag) => {
                setSelectedTag(tag);
                console.log("Clicked tag:", tag);
              }}
              selectedTagId={selectedTag?.id}
              layout="cloud"
              sortBy="postCount"
            />
          </CardBody>
        </Card>

        {/* 标签统计组件测试 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">标签统计组件</h2>
          </CardHeader>
          <CardBody>
            <TagStats tags={mockTags} />
          </CardBody>
        </Card>

        {/* 标签颜色选择器测试 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">标签颜色选择器</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-default-600">选择颜色：</span>
              <TagColorPicker value={selectedColor} onChange={setSelectedColor} />
            </div>

            <div className="flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              <span className="text-sm">当前颜色：</span>
              <code className="text-xs bg-default-100 px-2 py-1 rounded">{selectedColor}</code>
            </div>

            <div className="w-full h-8 rounded border" style={{ backgroundColor: selectedColor }} />
          </CardBody>
        </Card>
      </div>

      {/* 选中项信息 */}
      {(selectedCategory || selectedTag) && (
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">选中项信息</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {selectedCategory && (
                <div>
                  <h3 className="text-lg font-medium text-primary mb-2">选中的分类</h3>
                  <pre className="text-xs bg-default-100 p-3 rounded overflow-auto">
                    {JSON.stringify(selectedCategory, null, 2)}
                  </pre>
                </div>
              )}

              {selectedTag && (
                <div>
                  <h3 className="text-lg font-medium text-primary mb-2">选中的标签</h3>
                  <pre className="text-xs bg-default-100 p-3 rounded overflow-auto">
                    {JSON.stringify(selectedTag, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
