import Link from "next/link";
import { Clock, FolderOpen, Tag, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 模拟数据 - 后续会从数据库获取
const mockCategories = [
  { name: "技术分享", slug: "tech", count: 15 },
  { name: "前端开发", slug: "frontend", count: 12 },
  { name: "后端开发", slug: "backend", count: 8 },
  { name: "数据库", slug: "database", count: 6 },
  { name: "DevOps", slug: "devops", count: 4 },
];

const mockTags = [
  { name: "Next.js", slug: "nextjs", color: "#8B5CF6", count: 8 },
  { name: "React", slug: "react", color: "#10B981", count: 12 },
  { name: "TypeScript", slug: "typescript", color: "#3B82F6", count: 10 },
  { name: "Drizzle", slug: "drizzle", color: "#F59E0B", count: 5 },
  { name: "Tailwind CSS", slug: "tailwind", color: "#06B6D4", count: 7 },
  { name: "MySQL", slug: "mysql", color: "#EF4444", count: 4 },
];

const mockPopularPosts = [
  {
    title: "Next.js 15 新特性详解",
    slug: "nextjs-15-features",
    viewCount: 2500,
  },
  {
    title: "Drizzle ORM 最佳实践",
    slug: "drizzle-orm-best-practices",
    viewCount: 1800,
  },
  {
    title: "TypeScript 高级技巧",
    slug: "typescript-advanced-tips",
    viewCount: 1600,
  },
  {
    title: "现代前端工程化实践",
    slug: "modern-frontend-engineering",
    viewCount: 1400,
  },
];

export function BlogSidebar() {
  return (
    <div className="space-y-6">
      {/* 分类 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <span>文章分类</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
              >
                <span className="text-sm">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 标签云 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>热门标签</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockTags.map((tag) => (
              <Link key={tag.slug} href={`/tags/${tag.slug}`}>
                <Badge
                  variant="secondary"
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  style={{
                    backgroundColor: tag.color + "20",
                    color: tag.color,
                  }}
                >
                  {tag.name} ({tag.count})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 热门文章 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>热门文章</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPopularPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="flex items-start space-x-3">
                  <span className="text-sm font-bold text-muted-foreground min-w-[20px]">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.viewCount} 阅读</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 订阅 */}
      <Card>
        <CardHeader>
          <CardTitle>订阅更新</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">获取最新的技术文章和更新通知</p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="输入邮箱地址"
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              订阅
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
