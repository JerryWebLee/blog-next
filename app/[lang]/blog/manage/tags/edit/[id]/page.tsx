/**
 * 编辑标签页面
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader, Input, Spinner, Switch, Textarea } from "@heroui/react";
import { ArrowLeft, Edit, Tag as TagIcon } from "lucide-react";

import { ApiResponse, Tag, UpdateTagRequest } from "@/types/blog";

interface EditTagPageProps {
  params: Promise<{ id: string; lang: string }>;
}

export default function EditTagPage({ params }: EditTagPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tag, setTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<UpdateTagRequest>({
    name: "",
    slug: "",
    description: "",
    color: "#667eea",
    isActive: true,
  });

  // 获取标签信息
  const fetchTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`);
      const result: ApiResponse<Tag> = await response.json();

      if (result.success && result.data) {
        setTag(result.data);
        setFormData({
          name: result.data.name,
          slug: result.data.slug,
          description: result.data.description || "",
          color: result.data.color || "#667eea",
          isActive: result.data.isActive,
        });
      } else {
        alert(result.message || "获取标签信息失败");
        router.back();
      }
    } catch (error) {
      console.error("获取标签信息失败:", error);
      alert("获取标签信息失败");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // 更新标签
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert("标签名称是必填项");
      return;
    }

    if (!tag) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/tags/${tag.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        router.push("/blog/manage/tags");
        router.refresh();
      } else {
        alert(result.message || "更新标签失败");
      }
    } catch (error) {
      console.error("更新标签失败:", error);
      alert("更新标签失败");
    } finally {
      setSaving(false);
    }
  };

  // 初始化
  useEffect(() => {
    const initPage = async () => {
      const resolvedParams = await params;
      fetchTag(resolvedParams.id);
    };

    initPage();
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="text-center py-12">
        <p className="text-default-500">标签不存在</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <Button variant="light" isIconOnly onPress={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">编辑标签</h1>
          <p className="text-default-600 mt-2">编辑标签：{tag.name}</p>
        </div>
      </div>

      {/* 编辑表单 */}
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
                onValueChange={(value) => setFormData({ ...formData, name: value })}
                isRequired
                description="标签的显示名称"
              />
              <Input
                label="标签标识 (Slug)"
                placeholder="URL友好的标识符"
                value={formData.slug}
                onValueChange={(value) => setFormData({ ...formData, slug: value })}
                description="URL中使用的标识符"
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
              <Button type="submit" color="primary" startContent={<Edit className="w-4 h-4" />} isLoading={saving}>
                保存更改
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
