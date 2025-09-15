import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionaries";

// 模拟特色文章数据
const featuredPosts = [
  {
    id: 1,
    title: {
      'zh-CN': "使用 Next.js 15 构建现代化博客系统",
      'en-US': "Building Modern Blog System with Next.js 15",
      'ja-JP': "Next.js 15でモダンなブログシステムを構築"
    },
    excerpt: {
      'zh-CN': "本文介绍如何使用 Next.js 15 和 Drizzle ORM 构建一个功能完整的博客系统...",
      'en-US': "This article introduces how to build a fully functional blog system using Next.js 15 and Drizzle ORM...",
      'ja-JP': "この記事では、Next.js 15とDrizzle ORMを使用して完全に機能するブログシステムを構築する方法を紹介します..."
    },
    slug: "building-modern-blog-with-nextjs-15",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    category: {
      'zh-CN': "技术分享",
      'en-US': "Tech Sharing",
      'ja-JP': "技術共有"
    },
    readTime: 8,
    publishedAt: "2024-01-15",
  },
  {
    id: 2,
    title: {
      'zh-CN': "Drizzle ORM 入门指南：从零开始学习",
      'en-US': "Drizzle ORM Getting Started Guide: Learn from Scratch",
      'ja-JP': "Drizzle ORM入門ガイド：ゼロから学ぶ"
    },
    excerpt: {
      'zh-CN': "Drizzle ORM 是一个现代化的 TypeScript ORM，本文将从基础概念开始...",
      'en-US': "Drizzle ORM is a modern TypeScript ORM, this article will start from basic concepts...",
      'ja-JP': "Drizzle ORMはモダンなTypeScript ORMで、この記事では基本概念から始めます..."
    },
    slug: "drizzle-orm-getting-started",
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    category: {
      'zh-CN': "数据库",
      'en-US': "Database",
      'ja-JP': "データベース"
    },
    readTime: 12,
    publishedAt: "2024-01-10",
  },
];

// 模拟统计数据
const stats = [
  { 
    label: {
      'zh-CN': "文章总数",
      'en-US': "Total Posts",
      'ja-JP': "記事総数"
    },
    value: "156", 
    icon: FileText 
  },
  { 
    label: {
      'zh-CN': "注册用户",
      'en-US': "Registered Users",
      'ja-JP': "登録ユーザー"
    },
    value: "2.3k", 
    icon: Users 
  },
  { 
    label: {
      'zh-CN': "总浏览量",
      'en-US': "Total Views",
      'ja-JP': "総閲覧数"
    },
    value: "45.2k", 
    icon: TrendingUp 
  },
  { 
    label: {
      'zh-CN': "分类数量",
      'en-US': "Categories",
      'ja-JP': "カテゴリー数"
    },
    value: "12", 
    icon: BookOpen 
  },
];

type Locale = 'zh-CN' | 'en-US' | 'ja-JP';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div>
      {/* Hero 区域 */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {lang === 'zh-CN' && "欢迎来到 BlogNext"}
            {lang === 'en-US' && "Welcome to BlogNext"}
            {lang === 'ja-JP' && "BlogNextへようこそ"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {lang === 'zh-CN' && "基于 Next.js 15 和 Drizzle ORM 构建的现代化博客系统"}
            {lang === 'en-US' && "Modern blog system built with Next.js 15 and Drizzle ORM"}
            {lang === 'ja-JP' && "Next.js 15とDrizzle ORMで構築されたモダンなブログシステム"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/${lang}/blog`}>
                {dict.navigation.blog}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/${lang}/about`}>{dict.navigation.about}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full">
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="">{stat.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 特色文章 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {lang === 'zh-CN' && "特色文章"}
              {lang === 'en-US' && "Featured Posts"}
              {lang === 'ja-JP' && "注目の記事"}
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              {lang === 'zh-CN' && "精选优质技术文章，分享最新的技术趋势和开发经验"}
              {lang === 'en-US' && "Curated high-quality tech articles sharing the latest trends and development experience"}
              {lang === 'ja-JP' && "厳選された高品質な技術記事で、最新のトレンドと開発経験を共有"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={post.featuredImage} alt={post.title[lang]} fill className="object-cover" />
                  <Badge className="absolute top-4 left-4">{post.category[lang]}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">
                    <Link href={`/${lang}/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title[lang]}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-3">{post.excerpt[lang]}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{post.publishedAt}</span>
                    <span>
                      {lang === 'zh-CN' && `${post.readTime} 分钟阅读`}
                      {lang === 'en-US' && `${post.readTime} min read`}
                      {lang === 'ja-JP' && `${post.readTime}分で読める`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${lang}/blog`}>
                {lang === 'zh-CN' && "查看所有文章"}
                {lang === 'en-US' && "View All Posts"}
                {lang === 'ja-JP' && "すべての記事を見る"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 技术栈介绍 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {lang === 'zh-CN' && "技术栈"}
              {lang === 'en-US' && "Tech Stack"}
              {lang === 'ja-JP' && "技術スタック"}
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              {lang === 'zh-CN' && "采用现代化的技术栈，确保系统的高性能、可维护性和扩展性"}
              {lang === 'en-US' && "Using modern tech stack to ensure high performance, maintainability and scalability"}
              {lang === 'ja-JP' && "モダンな技術スタックを採用し、高性能、保守性、拡張性を確保"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">N</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Next.js 15</h3>
              <p className="">
                {lang === 'zh-CN' && "最新的 React 框架，提供优秀的开发体验和性能优化"}
                {lang === 'en-US' && "Latest React framework with excellent developer experience and performance optimization"}
                {lang === 'ja-JP' && "最新のReactフレームワークで、優れた開発体験とパフォーマンス最適化を提供"}
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">D</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Drizzle ORM</h3>
              <p className="">
                {lang === 'zh-CN' && "现代化的 TypeScript ORM，类型安全且性能优异"}
                {lang === 'en-US' && "Modern TypeScript ORM with type safety and excellent performance"}
                {lang === 'ja-JP' && "モダンなTypeScript ORMで、型安全性と優れたパフォーマンスを提供"}
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">T</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tailwind CSS</h3>
              <p className="">
                {lang === 'zh-CN' && "实用优先的 CSS 框架，快速构建现代化界面"}
                {lang === 'en-US' && "Utility-first CSS framework for rapidly building modern interfaces"}
                {lang === 'ja-JP' && "ユーティリティファーストのCSSフレームワークで、モダンなインターフェースを素早く構築"}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
