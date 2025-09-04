import { Suspense } from "react";

import { BlogFilters } from "@/components/blog/blog-filters";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { PostCard } from "@/components/blog/post-card";

// 模拟博客数据 - 后续会从数据库获取
const mockPosts = [
  {
    id: 1,
    title: "使用 Next.js 15 构建现代化博客系统",
    slug: "building-modern-blog-with-nextjs-15",
    excerpt:
      "本文介绍如何使用 Next.js 15 和 Drizzle ORM 构建一个功能完整的博客系统，包括数据库设计、API 开发、前端界面等...",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    author: {
      displayName: "张三",
      username: "zhangsan",
    },
    category: {
      name: "技术分享",
      slug: "tech",
    },
    tags: [
      { name: "Next.js", slug: "nextjs", color: "#8B5CF6" },
      { name: "React", slug: "react", color: "#10B981" },
      { name: "TypeScript", slug: "typescript", color: "#3B82F6" },
    ],
    publishedAt: new Date("2024-01-15"),
    viewCount: 1250,
    commentCount: 23,
    readTime: 8,
  },
  {
    id: 2,
    title: "Drizzle ORM 入门指南：从零开始学习",
    slug: "drizzle-orm-getting-started",
    excerpt:
      "Drizzle ORM 是一个现代化的 TypeScript ORM，本文将从基础概念开始，逐步介绍如何使用 Drizzle ORM 进行数据库操作...",
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    author: {
      displayName: "李四",
      username: "lisi",
    },
    category: {
      name: "数据库",
      slug: "database",
    },
    tags: [
      { name: "Drizzle", slug: "drizzle", color: "#F59E0B" },
      { name: "ORM", slug: "orm", color: "#EF4444" },
      { name: "MySQL", slug: "mysql", color: "#06B6D4" },
    ],
    publishedAt: new Date("2024-01-10"),
    viewCount: 890,
    commentCount: 15,
    readTime: 12,
  },
  {
    id: 3,
    title: "Tailwind CSS 4.0 新特性详解",
    slug: "tailwind-css-4-new-features",
    excerpt: "Tailwind CSS 4.0 带来了许多激动人心的新特性，包括新的颜色系统、改进的响应式设计、更好的性能等...",
    featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    author: {
      displayName: "王五",
      username: "wangwu",
    },
    category: {
      name: "前端开发",
      slug: "frontend",
    },
    tags: [
      { name: "Tailwind CSS", slug: "tailwind", color: "#06B6D4" },
      { name: "CSS", slug: "css", color: "#8B5CF6" },
      { name: "设计系统", slug: "design-system", color: "#10B981" },
    ],
    publishedAt: new Date("2024-01-05"),
    viewCount: 1560,
    commentCount: 31,
    readTime: 10,
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">博客文章</h1>
        <p className="text-xl text-muted-foreground">分享技术见解、学习心得和项目经验</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <BlogFilters />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Suspense fallback={<div>加载中...</div>}>
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Suspense>
          </div>

          {/* 分页 */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">上一页</button>
              <button className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md">1</button>
              <button className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">2</button>
              <button className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">3</button>
              <button className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">下一页</button>
            </nav>
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
