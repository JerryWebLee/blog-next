"use client";

import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image } from "@heroui/react";

import { SearchBar } from "@/components/layout/search-bar";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <header className="px-4 md:px-8 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              alt="荒野博客"
              src="/images/logo.png"
              width={40}
              height={40}
              isZoomed
              isBlurred
              fallbackSrc="/images/fallback.svg"
              as={NextImage}
            />
            <span className="text-xl font-bold md:block hidden">荒野博客</span>
          </Link>
        </div>

        {/* 主导航 */}
        <nav className="rounded-full hidden md:flex items-center space-x-6">
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
