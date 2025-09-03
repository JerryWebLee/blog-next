"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, FileText, Plus, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";

const navigationItems = [
  {
    title: "博客首页",
    href: "/blog",
    icon: Home,
    description: "查看所有博客文章",
  },
  {
    title: "博客管理",
    href: "/blog/manage",
    icon: FileText,
    description: "管理您的博客文章",
  },
  {
    title: "创建博客",
    href: "/blog/manage/create",
    icon: Plus,
    description: "创建新的博客文章",
  },
  {
    title: "统计分析",
    href: "/blog/manage/stats",
    icon: BarChart3,
    description: "查看博客统计数据",
  },
  {
    title: "系统设置",
    href: "/blog/manage/settings",
    icon: Settings,
    description: "配置博客系统",
  },
];

export function BlogNavigation() {
  const pathname = usePathname();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <nav className="flex flex-wrap gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "outline"}
                size="sm"
                asChild
                className="flex items-center gap-2"
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
