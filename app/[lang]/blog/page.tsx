"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { BookOpenIcon, CalendarIcon, FilterIcon, RefreshCwIcon, SearchIcon, TrendingUpIcon } from "lucide-react";

import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { PostCard } from "@/components/blog/post-card";
import { usePosts } from "@/lib/hooks/usePosts";
import { Post } from "@/types/blog";

export default function BlogWithAPIPage() {
  const router = useRouter();
  const params = useParams();
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("publishedAt");

  const {
    posts,
    loading,
    error,
    pagination,
    searchPosts,
    filterByCategory,
    sortPosts,
    goToPage,
    incrementViewCount,
    incrementLikeCount,
  } = usePosts({
    initialParams: {
      status: "published",
      visibility: "public",
      limit: 6,
    },
  });

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value);
    searchPosts(value);
  };

  // 处理分类筛选
  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    const categoryId = value === "all" ? null : Number(value);
    filterByCategory(categoryId);
  };

  // 处理排序
  const handleSort = (value: string) => {
    setSortBy(value);
    sortPosts(value, "desc");
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  // 处理文章交互
  const handleViewPost = async (post: Post) => {
    try {
      await incrementViewCount(post.id);
      router.push(`/${params.lang}/blog/${post.id}`);
    } catch (error) {
      console.error("增加浏览次数失败:", error);
    }
  };

  const handleLikePost = async (post: Post) => {
    await incrementLikeCount(post.id);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardBody className="text-center p-8">
            <div className="text-danger mb-4">
              <RefreshCwIcon className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">加载失败</h2>
              <p className="text-default-500">{error}</p>
            </div>
            <Button
              color="primary"
              variant="solid"
              startContent={<RefreshCwIcon className="w-4 h-4" />}
              onPress={() => window.location.reload()}
            >
              重新加载
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主内容区 */}
        <div className="lg:col-span-3">
          {/* 筛选器 */}
          <Card className="mb-6">
            <CardHeader className="flex gap-3">
              <FilterIcon className="w-5 h-5 text-primary" />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">筛选文章</p>
                <p className="text-small text-default-500">通过搜索、分类和排序找到您需要的文章</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 搜索 */}
                <Input
                  type="text"
                  placeholder="搜索文章标题或内容..."
                  value={searchValue}
                  onValueChange={handleSearch}
                  startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
                  variant="bordered"
                  size="md"
                />

                {/* 分类筛选 */}
                <Select
                  placeholder="选择分类"
                  selectedKeys={new Set([categoryFilter])}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    handleCategoryFilter(selectedKey);
                  }}
                  variant="bordered"
                  size="md"
                >
                  <SelectItem key="all">全部分类</SelectItem>
                  <SelectItem key="1">技术分享</SelectItem>
                  <SelectItem key="2">前端开发</SelectItem>
                  <SelectItem key="3">后端开发</SelectItem>
                  <SelectItem key="4">数据库</SelectItem>
                  <SelectItem key="5">DevOps</SelectItem>
                </Select>

                {/* 排序 */}
                <Select
                  placeholder="选择排序"
                  selectedKeys={new Set([sortBy])}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    handleSort(selectedKey);
                  }}
                  variant="bordered"
                  size="md"
                >
                  <SelectItem key="publishedAt">最新发布</SelectItem>
                  <SelectItem key="createdAt">创建时间</SelectItem>
                  <SelectItem key="viewCount">浏览次数</SelectItem>
                  <SelectItem key="likeCount">点赞次数</SelectItem>
                  <SelectItem key="title">标题排序</SelectItem>
                </Select>
              </div>
            </CardBody>
          </Card>

          {/* 文章列表 */}
          {loading ? (
            <Card>
              <CardBody className="text-center py-12">
                <Spinner size="lg" color="primary" />
                <p className="mt-4 text-default-500">加载中...</p>
              </CardBody>
            </Card>
          ) : posts.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-default-300" />
                <h3 className="text-xl font-semibold mb-2">暂无文章</h3>
                <p className="text-default-500">当前没有找到符合条件的文章</p>
              </CardBody>
            </Card>
          ) : (
            <>
              {/* 文章统计 */}
              <div className="flex items-center gap-4 mb-6">
                <Chip startContent={<TrendingUpIcon className="w-4 h-4" />} variant="flat" color="primary">
                  共找到 {pagination.total} 篇文章
                </Chip>
                <Chip startContent={<CalendarIcon className="w-4 h-4" />} variant="flat" color="secondary">
                  第 {pagination.page} 页 / 共 {pagination.totalPages} 页
                </Chip>
              </div>

              {/* 文章网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {(posts || []).map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      author: post.author
                        ? {
                            displayName: post.author.displayName || post.author.username,
                            username: post.author.username,
                          }
                        : {
                            displayName: "未知作者",
                            username: "unknown",
                          },
                      category: post.category
                        ? {
                            name: post.category.name,
                            slug: post.category.slug,
                          }
                        : undefined,
                      tags: post.tags?.map((tag) => ({
                        name: tag.name,
                        slug: tag.slug,
                        color: tag.color,
                      })),
                      commentCount: (post as any).commentCount || 0,
                      readTime: (post as any).readTime || 5,
                    }}
                    onView={() => handleViewPost(post)}
                    onLike={() => handleLikePost(post)}
                  />
                ))}
              </div>

              {/* 分页 */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    total={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    showControls
                    showShadow
                    color="primary"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
