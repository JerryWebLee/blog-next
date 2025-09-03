"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePosts } from "@/lib/hooks/usePosts";
import { Post, PostStatus, PostVisibility } from "@/types/blog";
import { Edit, Trash2, Eye, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function BlogManageWithAPIPage() {
  const {
    posts,
    loading,
    error,
    pagination,
    searchPosts,
    filterByStatus,
    filterByCategory,
    sortPosts,
    goToPage,
    deletePost,
    updatePostStatus,
  } = usePosts({
    initialParams: {
      limit: 10,
    },
    autoFetch: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | "">("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 处理搜索
  const handleSearch = () => {
    searchPosts(searchTerm);
  };

  // 处理状态筛选
  const handleStatusFilter = (status: PostStatus | "") => {
    setSelectedStatus(status);
    filterByStatus(status || null);
  };

  // 处理分类筛选
  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    filterByCategory(categoryId);
  };

  // 处理排序
  const handleSort = (sortBy: string) => {
    sortPosts(sortBy, 'desc');
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  // 处理删除文章
  const handleDeletePost = async (post: Post) => {
    if (window.confirm(`确定要删除文章"${post.title}"吗？`)) {
      const success = await deletePost(post.id);
      if (success) {
        alert('文章删除成功！');
      } else {
        alert('文章删除失败！');
      }
    }
  };

  // 处理状态更新
  const handleStatusUpdate = async (post: Post, newStatus: PostStatus) => {
    const success = await updatePostStatus(post.id, newStatus);
    if (success) {
      alert('状态更新成功！');
    } else {
      alert('状态更新失败！');
    }
  };

  // 获取状态标签颜色
  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // 获取可见性标签颜色
  const getVisibilityColor = (visibility: PostVisibility) => {
    switch (visibility) {
      case 'public':
        return 'bg-blue-100 text-blue-800';
      case 'private':
        return 'bg-red-100 text-red-800';
      case 'password':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">文章管理</h1>
          <p className="text-xl text-muted-foreground">
            管理您的博客文章
          </p>
        </div>
        <Link href="/blog/manage/create">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>创建文章</span>
          </Button>
        </Link>
      </div>

      {/* 筛选器 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>筛选文章</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜索 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">搜索</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="搜索文章标题..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>搜索</Button>
              </div>
            </div>

            {/* 状态筛选 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">状态</label>
              <select 
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedStatus}
                onChange={(e) => handleStatusFilter(e.target.value as PostStatus | "")}
              >
                <option value="">全部状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="archived">已归档</option>
              </select>
            </div>

            {/* 分类筛选 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">分类</label>
              <select 
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedCategory || ""}
                onChange={(e) => handleCategoryFilter(e.target.value ? Number(e.target.value) : null)}
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
                <option value="createdAt">创建时间</option>
                <option value="updatedAt">更新时间</option>
                <option value="publishedAt">发布时间</option>
                <option value="viewCount">浏览次数</option>
                <option value="likeCount">点赞次数</option>
                <option value="title">标题排序</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 文章列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">暂无文章</h3>
          <p className="text-muted-foreground">当前没有找到符合条件的文章</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status === 'published' ? '已发布' : 
                         post.status === 'draft' ? '草稿' : '已归档'}
                      </Badge>
                      <Badge className={getVisibilityColor(post.visibility)}>
                        {post.visibility === 'public' ? '公开' : 
                         post.visibility === 'private' ? '私有' : '密码保护'}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>作者: {post.author?.displayName || '未知'}</span>
                      <span>分类: {post.category?.name || '未分类'}</span>
                      <span>浏览: {post.viewCount || 0}</span>
                      <span>点赞: {post.likeCount || 0}</span>
                      <span>创建: {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <Link href={`/blog/manage/edit/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeletePost(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* 快速操作 */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">快速操作:</span>
                    {post.status !== 'published' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(post, 'published')}
                      >
                        发布
                      </Button>
                    )}
                    {post.status === 'published' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(post, 'draft')}
                      >
                        设为草稿
                      </Button>
                    )}
                    {post.status !== 'archived' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(post, 'archived')}
                      >
                        归档
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    ID: {post.id} | Slug: {post.slug}
                  </div>
                </div>
              </CardContent>
            </Card>
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
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
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

      {/* 统计信息 */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        第 {pagination.page} 页，共 {pagination.totalPages} 页，总计 {pagination.total} 篇文章
      </div>
    </div>
  );
}
