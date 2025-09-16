"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { Switch } from "@heroui/switch";
import { Textarea } from "@heroui/react";
import { ArrowLeft, Eye, EyeOff, FileText, Save } from "lucide-react";

import { Post, PostStatus, PostVisibility, UpdatePostRequest } from "@/types/blog";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  const [formData, setFormData] = useState<UpdatePostRequest>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    categoryId: undefined,
    status: "draft",
    visibility: "public",
    password: "",
    allowComments: true,
    tagIds: [],
  });

  // 获取博客数据
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${postId}`);
        const result = await response.json();

        if (result.success) {
          const postData = result.data;
          setPost(postData);
          setFormData({
            title: postData.title || "",
            slug: postData.slug || "",
            excerpt: postData.excerpt || "",
            content: postData.content || "",
            featuredImage: postData.featuredImage || "",
            categoryId: postData.categoryId,
            status: postData.status || "draft",
            visibility: postData.visibility || "public",
            password: postData.password || "",
            allowComments: postData.allowComments ?? true,
            tagIds: postData.tags?.map((tag: any) => tag.id) || [],
          });
        } else {
          alert("获取博客数据失败");
          router.push("/blog/manage");
        }
      } catch (error) {
        console.error("获取博客数据失败:", error);
        alert("获取博客数据失败");
        router.push("/blog/manage");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, router]);

  // 处理表单输入变化
  const handleInputChange = (field: keyof UpdatePostRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 自动生成slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // 处理标题变化时自动生成slug
  const handleTitleChange = (title: string) => {
    handleInputChange("title", title);
    if (!formData.slug) {
      handleInputChange("slug", generateSlug(title));
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.content?.trim()) {
      alert("请填写标题和内容");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("博客更新成功！");
        router.push("/blog/manage");
      } else {
        alert(`更新失败: ${result.message}`);
      }
    } catch (error) {
      console.error("更新博客失败:", error);
      alert("更新博客失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardBody className="text-center py-8">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-default-500">加载中...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardBody className="text-center py-8">
            <p className="text-default-500">博客不存在</p>
            <Button onPress={() => router.push("/blog/manage")} className="mt-4" color="primary">
              返回管理页面
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 页面标题和返回按钮 */}
      <div className="flex items-center gap-4">
        <Button
          variant="bordered"
          size="sm"
          onPress={() => router.back()}
          startContent={<ArrowLeft className="w-4 h-4" />}
        >
          返回
        </Button>
        <div>
          <h1 className="text-3xl font-bold">编辑博客</h1>
          <p className="text-default-500">编辑博客文章: {post.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader className="flex gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">基本信息</p>
              <p className="text-small text-default-500">编辑博客的基本信息</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="标题"
                placeholder="输入博客标题"
                value={formData.title}
                onValueChange={handleTitleChange}
                variant="bordered"
                isRequired
              />
              <Input
                label="别名"
                placeholder="自动生成或手动输入"
                value={formData.slug}
                onValueChange={(value: string) => handleInputChange("slug", value)}
                variant="bordered"
              />
            </div>

            <Textarea
              label="摘要"
              placeholder="博客摘要（可选）"
              value={formData.excerpt}
              onValueChange={(value: string) => handleInputChange("excerpt", value)}
              variant="bordered"
              minRows={3}
            />

            <Input
              label="特色图片URL"
              placeholder="图片链接地址"
              value={formData.featuredImage}
              onValueChange={(value: string) => handleInputChange("featuredImage", value)}
              variant="bordered"
              type="url"
            />
          </CardBody>
        </Card>

        {/* 内容 */}
        <Card>
          <CardHeader>
            <p className="text-lg font-semibold">内容</p>
          </CardHeader>
          <CardBody>
            <Textarea
              label="内容"
              placeholder="输入博客内容..."
              value={formData.content}
              onValueChange={(value: string) => handleInputChange("content", value)}
              variant="bordered"
              minRows={15}
              isRequired
            />
          </CardBody>
        </Card>

        {/* 设置 */}
        <Card>
          <CardHeader>
            <p className="text-lg font-semibold">设置</p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="状态"
                placeholder="选择状态"
                selectedKeys={formData.status ? new Set([formData.status]) : new Set()}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange("status", selectedKey as PostStatus);
                }}
                variant="bordered"
              >
                <SelectItem key="draft">
                  草稿
                </SelectItem>
                <SelectItem key="published">
                  发布
                </SelectItem>
                <SelectItem key="archived">
                  归档
                </SelectItem>
              </Select>

              <Select
                label="可见性"
                placeholder="选择可见性"
                selectedKeys={formData.visibility ? new Set([formData.visibility]) : new Set()}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange("visibility", selectedKey as PostVisibility);
                }}
                variant="bordered"
              >
                <SelectItem key="public">
                  公开
                </SelectItem>
                <SelectItem key="private">
                  私有
                </SelectItem>
                <SelectItem key="password">
                  密码保护
                </SelectItem>
              </Select>
            </div>

            {formData.visibility === "password" && (
              <Input
                label="访问密码"
                placeholder="设置访问密码"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onValueChange={(value: string) => handleInputChange("password", value)}
                variant="bordered"
                endContent={
                  <Button isIconOnly variant="light" size="sm" onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                }
              />
            )}

            <Switch
              isSelected={formData.allowComments}
              onValueChange={(checked) => handleInputChange("allowComments", checked)}
            >
              允许评论
            </Switch>
          </CardBody>
        </Card>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-4">
          <Button variant="bordered" onPress={() => router.back()}>
            取消
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={saving}
            startContent={!saving && <Save className="w-4 h-4" />}
          >
            {saving ? "保存中..." : "保存更改"}
          </Button>
        </div>
      </form>
    </div>
  );
}
