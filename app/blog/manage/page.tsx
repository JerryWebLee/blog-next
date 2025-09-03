"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { Post, PostStatus, PostVisibility } from "@/types/blog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BlogNavigation } from "@/components/blog/blog-navigation";

export default function BlogManagePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [visibilityFilter, setVisibilityFilter] = useState<PostVisibility | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 获取博客列表
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(visibilityFilter !== "all" && { visibility: visibilityFilter }),
      });

      const response = await fetch(`/api/posts?${params}`);
      const result = await response.json();

      if (result.success) {
        setPosts(result.data.data);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("获取博客列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, statusFilter, visibilityFilter]);

  // 删除博客
  const handleDelete = async (postId: number) => {
    if (!confirm("确定要删除这篇博客吗？")) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPosts(); // 重新获取列表
      }
    } catch (error) {
      console.error("删除博客失败:", error);
    }
  };

  // 获取状态标签颜色
  const getStatusBadgeVariant = (status: PostStatus) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  // 获取可见性标签颜色
  const getVisibilityBadgeVariant = (visibility: PostVisibility) => {
    switch (visibility) {
      case "public":
        return "default";
      case "private":
        return "secondary";
      case "password":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 导航 */}
      <BlogNavigation />
      
      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">博客管理</h1>
          <p className="text-muted-foreground">管理您的所有博客文章</p>
        </div>
        <Button asChild>
          <a href="/blog/manage/create">
            <Plus className="mr-2 h-4 w-4" />
            创建博客
          </a>
        </Button>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            搜索和过滤
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索博客标题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PostStatus | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="archived">已归档</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={(value) => setVisibilityFilter(value as PostVisibility | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="选择可见性" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有可见性</SelectItem>
                <SelectItem value="public">公开</SelectItem>
                <SelectItem value="private">私有</SelectItem>
                <SelectItem value="password">密码保护</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchPosts}>
              应用过滤
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 博客列表 */}
      <Card>
        <CardHeader>
          <CardTitle>博客列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">加载中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">暂无博客文章</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <Badge variant={getStatusBadgeVariant(post.status)}>
                        {post.status === "published" ? "已发布" : 
                         post.status === "draft" ? "草稿" : "已归档"}
                      </Badge>
                      <Badge variant={getVisibilityBadgeVariant(post.visibility)}>
                        {post.visibility === "public" ? "公开" : 
                         post.visibility === "private" ? "私有" : "密码保护"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {post.excerpt || "暂无摘要"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>作者: {post.author?.displayName || "未知"}</span>
                      <span>分类: {post.category?.name || "未分类"}</span>
                      <span>浏览量: {post.viewCount}</span>
                      <span>创建时间: {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/blog/${post.slug}`}>
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/blog/manage/edit/${post.id}`}>
                        <Edit className="h-4 w-4" />
                      </a>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDelete(post.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            上一页
          </Button>
          <span className="flex items-center px-4">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
