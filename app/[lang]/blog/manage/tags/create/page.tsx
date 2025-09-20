/**
 * 创建标签页面
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader, Input, Switch, Textarea } from "@heroui/react";
import { ArrowLeft, Plus, Tag as TagIcon } from "lucide-react";

import { ApiResponse, CreateTagRequest } from "@/types/blog";

export default function CreateTagPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTagRequest>({
    name: "",
    slug: "",
    description: "",
    color: "#667eea",
    isActive: true,
  });

  // 自动生成slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // 处理名称变化
  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: formData.slug || generateSlug(value),
    });
  };

  // 创建标签
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("标签名称是必填项");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.name),
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        router.push("/blog/manage/tags");
        router.refresh();
      } else {
        alert(result.message || "创建标签失败");
      }
    } catch (error) {
      console.error("创建标签失败:", error);
      alert("创建标签失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <Button variant="light" isIconOnly onPress={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">创建标签</h1>
          <p className="text-default-600 mt-2">创建新的博客标签</p>
        </div>
      </div>

      {/* 创建表单 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TagIcon className="w-5 h-5" />
            <span className="text-lg font-semibold">标签信息</span>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="标签名称"
                placeholder="请输入标签名称"
                value={formData.name}
                onValueChange={handleNameChange}
                isRequired
                description="标签的显示名称"
              />
              <Input
                label="标签标识 (Slug)"
                placeholder="URL友好的标识符"
                value={formData.slug}
                onValueChange={(value) => setFormData({ ...formData, slug: value })}
                description="留空将自动生成"
              />
            </div>

            <Textarea
              label="标签描述"
              placeholder="请输入标签描述"
              value={formData.description}
              onValueChange={(value) => setFormData({ ...formData, description: value })}
              description="可选的标签描述信息"
              minRows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">标签颜色</label>
                <div className="flex gap-4">
                  <Input
                    type="color"
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                    className="w-20"
                  />
                  <Input
                    placeholder="#667eea"
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">状态</label>
                <div className="flex items-center gap-2">
                  <Switch
                    isSelected={formData.isActive}
                    onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                    color="success"
                  />
                  <span className="text-sm text-default-600">{formData.isActive ? "激活" : "停用"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="light" onPress={() => router.back()}>
                取消
              </Button>
              <Button type="submit" color="primary" startContent={<Plus className="w-4 h-4" />} isLoading={loading}>
                创建标签
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
