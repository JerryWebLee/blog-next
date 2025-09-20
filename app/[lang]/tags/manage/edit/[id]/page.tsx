/**
 * 编辑标签页面
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
  Switch,
  Textarea,
  Divider,
  Chip,
  Badge,
} from "@heroui/react";
import { ArrowLeft, Edit, Tag as TagIcon, Palette, Hash, FileText, Eye, Calendar, Save } from "lucide-react";

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
        router.push("/tags/manage");
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

  // 预设颜色
  const presetColors = [
    "#667eea", "#764ba2", "#f093fb", "#f5576c", 
    "#4facfe", "#00f2fe", "#43e97b", "#38f9d7",
    "#ffecd2", "#fcb69f", "#a8edea", "#fed6e3"
  ];

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
        <TagIcon className="w-16 h-16 text-default-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-default-600 mb-2">标签不存在</h3>
        <p className="text-default-500 mb-4">请检查标签ID是否正确</p>
        <Button 
          color="primary" 
          onPress={() => router.back()}
        >
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <Button
          variant="light"
          isIconOnly
          onPress={() => router.back()}
          className="hover:bg-default-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            编辑标签
          </h1>
          <p className="text-default-600 mt-2 text-lg">编辑标签：{tag.name}</p>
        </div>
        <Badge content="ID" color="primary" variant="flat">
          <Chip size="sm" variant="flat">
            #{tag.id}
          </Chip>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 编辑表单 */}
        <div className="lg:col-span-2">
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
                    startContent={<Hash className="w-4 h-4 text-default-400" />}
                    className="w-full"
                  />
                  <Input
                    label="标签标识 (Slug)"
                    placeholder="URL友好的标识符"
                    value={formData.slug}
                    onValueChange={(value) => setFormData({ ...formData, slug: value })}
                    description="URL中使用的标识符"
                    startContent={<TagIcon className="w-4 h-4 text-default-400" />}
                    className="w-full"
                  />
                </div>

                <Textarea
                  label="标签描述"
                  placeholder="请输入标签描述"
                  value={formData.description}
                  onValueChange={(value) => setFormData({ ...formData, description: value })}
                  description="可选的标签描述信息"
                  minRows={3}
                  startContent={<FileText className="w-4 h-4 text-default-400" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">标签颜色</label>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Input
                          type="color"
                          value={formData.color}
                          onValueChange={(value) => setFormData({ ...formData, color: value })}
                          className="w-16 h-10"
                        />
                        <Input
                          placeholder="#667eea"
                          value={formData.color}
                          onValueChange={(value) => setFormData({ ...formData, color: value })}
                          className="flex-1"
                          startContent={<Palette className="w-4 h-4 text-default-400" />}
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-default-600">预设颜色</p>
                        <div className="flex flex-wrap gap-2">
                          {presetColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => setFormData({ ...formData, color })}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">状态</label>
                    <div className="flex items-center gap-3 p-4 bg-default-50 rounded-lg">
                      <Switch
                        isSelected={formData.isActive}
                        onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                        color="success"
                        size="lg"
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          {formData.isActive ? "激活" : "停用"}
                        </p>
                        <p className="text-sm text-default-500">
                          {formData.isActive ? "标签将显示在网站上" : "标签将隐藏"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider />

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="light"
                    onPress={() => router.back()}
                    className="flex-1"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    startContent={<Save className="w-4 h-4" />}
                    isLoading={saving}
                    className="flex-1"
                  >
                    {saving ? "保存中..." : "保存更改"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* 预览和详情卡片 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 预览卡片 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span className="text-lg font-semibold">预览</span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-default-50 to-default-100 rounded-lg">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                      style={{ backgroundColor: formData.color || "#667eea" }}
                    >
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">
                        {formData.name || "标签名称"}
                      </div>
                      <div className="text-sm text-default-500">
                        #{formData.slug || "标签标识"}
                      </div>
                    </div>
                  </div>
                  
                  {formData.description && (
                    <p className="text-sm text-default-600 mb-3">
                      {formData.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-center gap-2">
                    <Chip
                      size="sm"
                      color={formData.isActive ? "success" : "warning"}
                      variant="flat"
                    >
                      {formData.isActive ? "激活" : "停用"}
                    </Chip>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 标签详情卡片 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg font-semibold">标签详情</span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-500">标签ID</span>
                  <span className="font-medium">#{tag.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-500">创建时间</span>
                  <span className="font-medium">
                    {new Date(tag.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-500">更新时间</span>
                  <span className="font-medium">
                    {new Date(tag.updatedAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-500">文章数量</span>
                  <span className="font-medium">
                    {(tag as any).postCount || 0} 篇
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-500">当前状态</span>
                  <Chip
                    size="sm"
                    color={tag.isActive ? "success" : "warning"}
                    variant="flat"
                  >
                    {tag.isActive ? "激活" : "停用"}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
