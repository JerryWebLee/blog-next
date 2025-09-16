"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import {
  Bookmark,
  Calendar,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";

import { BlogNavigation } from "@/components/blog/blog-navigation";
import { Post, PostStatus, PostVisibility } from "@/types/blog";

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
        fetchPosts();
      }
    } catch (error) {
      console.error("删除博客失败:", error);
    }
  };

  // 获取状态标签颜色
  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  // 获取可见性标签颜色
  const getVisibilityColor = (visibility: PostVisibility) => {
    switch (visibility) {
      case "public":
        return "primary";
      case "private":
        return "secondary";
      case "password":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 导航 */}
      <BlogNavigation />

      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">博客管理</h1>
          <p className="text-default-500">管理您的所有博客文章</p>
        </div>
        <Button as="a" href="/blog/manage/create" color="primary" size="lg" startContent={<Plus className="w-5 h-5" />}>
          创建博客
        </Button>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardHeader className="flex gap-3">
          <Filter className="w-5 h-5 text-primary" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">搜索和过滤</p>
            <p className="text-small text-default-500">快速找到您需要的文章</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="搜索博客标题..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<Search className="w-4 h-4 text-default-400" />}
              variant="bordered"
            />
            <Select
              placeholder="选择状态"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setStatusFilter(selectedKey as PostStatus | "all");
              }}
              variant="bordered"
            >
              <SelectItem key="all">所有状态</SelectItem>
              <SelectItem key="draft">草稿</SelectItem>
              <SelectItem key="published">已发布</SelectItem>
              <SelectItem key="archived">已归档</SelectItem>
            </Select>
            <Select
              placeholder="选择可见性"
              selectedKeys={[visibilityFilter]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setVisibilityFilter(selectedKey as PostVisibility | "all");
              }}
              variant="bordered"
            >
              <SelectItem key="all">所有可见性</SelectItem>
              <SelectItem key="public">公开</SelectItem>
              <SelectItem key="private">私有</SelectItem>
              <SelectItem key="password">密码保护</SelectItem>
            </Select>
            <Button color="primary" variant="flat" onPress={fetchPosts}>
              应用过滤
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 博客列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <p className="text-lg font-semibold">博客列表</p>
            {!loading && posts.length > 0 && (
              <Chip color="primary" variant="flat">
                共 {posts.length} 篇文章
              </Chip>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-8">
              <Spinner size="lg" color="primary" />
              <p className="mt-4 text-default-500">加载中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-default-300" />
              <p className="text-default-500">暂无博客文章</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(posts || []).map((post) => (
                <Card key={post.id} className="border-1 hover:border-primary transition-colors">
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">{post.title}</h3>
                          <Chip size="sm" color={getStatusColor(post.status)} variant="flat">
                            {post.status === "published" ? "已发布" : post.status === "draft" ? "草稿" : "已归档"}
                          </Chip>
                          <Chip size="sm" color={getVisibilityColor(post.visibility)} variant="flat">
                            {post.visibility === "public"
                              ? "公开"
                              : post.visibility === "private"
                                ? "私有"
                                : "密码保护"}
                          </Chip>
                        </div>

                        <p className="text-default-500 text-sm line-clamp-2 mb-3">{post.excerpt || "暂无摘要"}</p>

                        <div className="flex items-center gap-4 text-sm text-default-400">
                          <div className="flex items-center gap-1">
                            <Avatar size="sm" name={post.author?.displayName || "未知"} className="w-4 h-4" />
                            <span>作者: {post.author?.displayName || "未知"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bookmark className="w-4 h-4" />
                            <span>分类: {post.category?.name || "未分类"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>浏览: {post.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button isIconOnly size="sm" variant="flat" color="default" as="a" href={`/blog/${post.slug}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="primary"
                          as="a"
                          href={`/blog/manage/edit/${post.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="flat" color="default">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="delete"
                              color="danger"
                              startContent={<Trash2 className="w-4 h-4" />}
                              onPress={() => handleDelete(post.id)}
                            >
                              删除
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-4">
            <Button
              variant="bordered"
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
              isDisabled={currentPage === 1}
            >
              上一页
            </Button>
            <Chip color="primary" variant="flat">
              第 {currentPage} 页 / 共 {totalPages} 页
            </Chip>
            <Button
              variant="bordered"
              onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              isDisabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
