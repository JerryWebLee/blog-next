"use client";

import { Suspense } from "react";
import { PostCard } from "@/components/blog/post-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePosts } from "@/lib/hooks/usePosts";
import { Post } from "@/types/blog";

export default function BlogWithAPIPage() {
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
  const handleSearch = (searchTerm: string) => {
    searchPosts(searchTerm);
  };

  // 处理分类筛选
  const handleCategoryFilter = (categoryId: number | null) => {
    filterByCategory(categoryId);
  };

  // 处理排序
  const handleSort = (sortBy: string) => {
    sortPosts(sortBy, "desc");
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  // 处理文章交互
  const handleViewPost = async (post: Post) => {
    await incrementViewCount(post.id);
    // 这里可以导航到文章详情页
    console.log("查看文章:", post.slug);
  };

  const handleLikePost = async (post: Post) => {
    await incrementLikeCount(post.id);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">加载失败</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>重新加载</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">博客文章</h1>
        <p className="text-xl text-muted-foreground">
          分享技术见解、学习心得和项目经验
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主内容区 */}
        <div className="lg:col-span-3">
          {/* 筛选器 */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">筛选文章</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 搜索 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">搜索</label>
                <Input
                  placeholder="搜索文章标题或内容..."
                  className="w-full"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* 分类筛选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">分类</label>
                <select
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  onChange={(e) =>
                    handleCategoryFilter(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">全部分类</option>
                  <option value="1">技术分享</option>
                  <option value="2">前端开发</option>
                  <option value="3">后端开发</option>
                  <option value="4">数据库</option>
                  <option value="5">DevOps</option>
                </select>
              </div>

              {/* 排序 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">排序</label>
                <select
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="publishedAt">最新发布</option>
                  <option value="createdAt">创建时间</option>
                  <option value="viewCount">浏览次数</option>
                  <option value="likeCount">点赞次数</option>
                  <option value="title">标题排序</option>
                </select>
              </div>
            </div>
          </div>

          {/* 文章列表 */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">加载中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">暂无文章</h3>
              <p className="text-muted-foreground">
                当前没有找到符合条件的文章
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onView={() => handleViewPost(post)}
                  onLike={() => handleLikePost(post)}
                />
              ))}
            </div>
          )}

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  上一页
                </Button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === pagination.page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  下一页
                </Button>
              </nav>
            </div>
          )}

          {/* 分页信息 */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            第 {pagination.page} 页，共 {pagination.totalPages} 页，总计{" "}
            {pagination.total} 篇文章
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
