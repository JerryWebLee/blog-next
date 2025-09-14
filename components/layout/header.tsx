"use client";

import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image } from "@heroui/react";
import clsx from "clsx";
import { BookImageIcon, ClipboardPlus, HouseIcon, LibraryBig, TagIcon } from "lucide-react";

import { SearchBar } from "@/components/layout/search-bar";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "首页", href: "/", icon: <HouseIcon width={"1em"} height={"1em"} /> },
    { name: "博客", href: "/blog", icon: <BookImageIcon width={"1em"} height={"1em"} /> },
    { name: "分类", href: "/categories", icon: <LibraryBig width={"1em"} height={"1em"} /> },
    { name: "标签", href: "/tags", icon: <TagIcon width={"1em"} height={"1em"} /> },
    { name: "关于", href: "/about", icon: <ClipboardPlus width={"1em"} height={"1em"} /> },
  ];

  return (
    <header className="blog-border-y-box-shadow w-full h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo */}
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
      {/* 主导航 */}
      <nav className="w-[60%] relative flex items-center h-[48px] bg-[hsla(var(--blog-nav-background))] blog-box-shadow rounded-full">
        <div
          style={{
            width: `${100 / navigation.length}%`,
            transition: ".9s cubic-bezier(.98,-.65,.265,1.55),background-color .5s",
            willChange: "transform,background-color",
            boxShadow: "0 0 10px var(--blog-color-bg-end)",
            transform: `translateX(${(navigation.findIndex((item) => item.href === pathname) ?? 0) * 100}%)`,
          }}
          className="bg-[var(--blog-nav-link-active-color-bg)] h-full absolute left-0 rounded-full"
        ></div>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              `relative z-[1] flex items-center justify-center flex-1 h-full transition-colors hover:text-primary`,
              pathname === item.href ? "link-active" : undefined
            )}
          >
            {item.icon}
            <span className="ml-1 hidden md:block">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* 右侧操作区 */}
      <div className="flex items-center space-x-2">
        <SearchBar />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
