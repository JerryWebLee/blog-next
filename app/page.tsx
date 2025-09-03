import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";

// 模拟特色文章数据
const featuredPosts = [
  {
    id: 1,
    title: "使用 Next.js 15 构建现代化博客系统",
    excerpt:
      "本文介绍如何使用 Next.js 15 和 Drizzle ORM 构建一个功能完整的博客系统...",
    slug: "building-modern-blog-with-nextjs-15",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    category: "技术分享",
    readTime: 8,
    publishedAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Drizzle ORM 入门指南：从零开始学习",
    excerpt:
      "Drizzle ORM 是一个现代化的 TypeScript ORM，本文将从基础概念开始...",
    slug: "drizzle-orm-getting-started",
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    category: "数据库",
    readTime: 12,
    publishedAt: "2024-01-10",
  },
];

// 模拟统计数据
const stats = [
  { label: "文章总数", value: "156", icon: FileText },
  { label: "注册用户", value: "2.3k", icon: Users },
  { label: "总浏览量", value: "45.2k", icon: TrendingUp },
  { label: "分类数量", value: "12", icon: BookOpen },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero 区域 */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            欢迎来到{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              BlogNext
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            基于 Next.js 15 和 Drizzle ORM 构建的现代化博客系统
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/blog">
                浏览文章
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 特色文章 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              特色文章
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              精选优质技术文章，分享最新的技术趋势和开发经验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary/90">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.publishedAt}</span>
                    <span>{post.readTime} 分钟阅读</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">
                查看所有文章
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 技术栈介绍 */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              技术栈
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              采用现代化的技术栈，确保系统的高性能、可维护性和扩展性
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  N
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Next.js 15</h3>
              <p className="text-gray-600 dark:text-gray-400">
                最新的 React 框架，提供优秀的开发体验和性能优化
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  D
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Drizzle ORM</h3>
              <p className="text-gray-600 dark:text-gray-400">
                现代化的 TypeScript ORM，类型安全且性能优异
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  T
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-gray-600 dark:text-gray-400">
                实用优先的 CSS 框架，快速构建现代化界面
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
