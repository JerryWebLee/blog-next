"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TestPage() {
  const [testData, setTestData] = useState({
    title: "测试博客标题",
    content: "这是一个测试博客的内容，用于验证UI组件是否正常工作。",
    excerpt: "测试博客摘要",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
  });

  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 测试创建博客API
  const testCreatePost = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: testData.title,
          content: testData.content,
          excerpt: testData.excerpt,
          featuredImage: testData.featuredImage,
          status: "draft",
          visibility: "public",
        }),
      });

      const result = await response.json();
      setApiResponse(result);
    } catch (error) {
      setApiResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // 测试获取博客列表API
  const testGetPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/posts?limit=5");
      const result = await response.json();
      setApiResponse(result);
    } catch (error) {
      setApiResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // 预设的特色图片URL
  const presetImages = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">博客管理功能测试</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 测试表单 */}
        <Card>
          <CardHeader>
            <CardTitle>测试数据</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">标题</label>
              <Input
                value={testData.title}
                onChange={(e) => setTestData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">摘要</label>
              <Input
                value={testData.excerpt}
                onChange={(e) => setTestData((prev) => ({ ...prev, excerpt: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">特色图片URL</label>
              <Input
                value={testData.featuredImage}
                onChange={(e) =>
                  setTestData((prev) => ({
                    ...prev,
                    featuredImage: e.target.value,
                  }))
                }
                placeholder="输入图片URL"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {presetImages.map((url, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setTestData((prev) => ({ ...prev, featuredImage: url }))}
                  >
                    图片{index + 1}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">内容</label>
              <Textarea
                value={testData.content}
                onChange={(e) => setTestData((prev) => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* 测试按钮 */}
        <Card>
          <CardHeader>
            <CardTitle>API测试</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testCreatePost} disabled={loading} className="w-full">
              {loading ? "测试中..." : "测试创建博客"}
            </Button>

            <Button onClick={testGetPosts} disabled={loading} variant="outline" className="w-full">
              {loading ? "测试中..." : "测试获取博客列表"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 特色图片预览 */}
      {testData.featuredImage && (
        <Card>
          <CardHeader>
            <CardTitle>特色图片预览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img src={testData.featuredImage} alt="预览图片" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{testData.featuredImage}</p>
          </CardContent>
        </Card>
      )}

      {/* API响应结果 */}
      {apiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>API响应结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-auto">{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>

            {apiResponse.success && (
              <div className="mt-4">
                <Badge variant="default">API调用成功</Badge>
              </div>
            )}

            {apiResponse.error && (
              <div className="mt-4">
                <Badge variant="destructive">API调用失败</Badge>
                <p className="text-red-500 mt-2">{apiResponse.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 组件展示 */}
      <Card>
        <CardHeader>
          <CardTitle>UI组件展示</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">默认标签</Badge>
            <Badge variant="secondary">次要标签</Badge>
            <Badge variant="outline">轮廓标签</Badge>
            <Badge variant="destructive">危险标签</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm">小按钮</Button>
            <Button>默认按钮</Button>
            <Button size="lg">大按钮</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline">轮廓按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="destructive">危险按钮</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
