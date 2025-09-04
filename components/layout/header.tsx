"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SearchBar } from "@/components/layout/search-bar";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "首页", href: "/" },
    { name: "博客", href: "/blog" },
    { name: "分类", href: "/categories" },
    { name: "标签", href: "/tags" },
    { name: "关于", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="text-xl font-bold">BlogNext</span>
          </Link>
        </div>

        {/* 主导航 */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-4">
          <SearchBar />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
