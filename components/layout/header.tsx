"use client";

import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image } from "@heroui/react";
import clsx from "clsx";
import { BookImageIcon, ClipboardPlus, HouseIcon, LibraryBig, TagIcon } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SearchBar } from "@/components/layout/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";

export function Header() {
  const pathname = usePathname();

  // 从路径中提取当前语言
  const currentLang = pathname.split("/")[1] || "zh-CN";

  // 多语言导航配置
  const navigation = [
    {
      name: {
        "zh-CN": "首页",
        "en-US": "Home",
        "ja-JP": "ホーム",
      },
      href: `/${currentLang}`,
      icon: <HouseIcon width={"1em"} height={"1em"} />,
    },
    {
      name: {
        "zh-CN": "博客",
        "en-US": "Blog",
        "ja-JP": "ブログ",
      },
      href: `/${currentLang}/blog`,
      icon: <BookImageIcon width={"1em"} height={"1em"} />,
    },
    {
      name: {
        "zh-CN": "分类",
        "en-US": "Categories",
        "ja-JP": "カテゴリー",
      },
      href: `/${currentLang}/categories`,
      icon: <LibraryBig width={"1em"} height={"1em"} />,
    },
    {
      name: {
        "zh-CN": "标签",
        "en-US": "Tags",
        "ja-JP": "タグ",
      },
      href: `/${currentLang}/tags`,
      icon: <TagIcon width={"1em"} height={"1em"} />,
    },
    {
      name: {
        "zh-CN": "关于",
        "en-US": "About",
        "ja-JP": "について",
      },
      href: `/${currentLang}/about`,
      icon: <ClipboardPlus width={"1em"} height={"1em"} />,
    },
  ];

  let activeIndex = navigation.findIndex((item) => item.href === pathname);

  // 多语言标题
  const siteTitle = {
    "zh-CN": "荒野博客",
    "en-US": "Wilderness Blog",
    "ja-JP": "ワイルドネスブログ",
  };

  return (
    <header className="blog-border-y-box-shadow w-full h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo */}
      <Link href={`/${currentLang}`} className="flex items-center space-x-2">
        <Image
          alt={siteTitle[currentLang as keyof typeof siteTitle]}
          src="/images/logo.png"
          width={40}
          height={40}
          isZoomed
          isBlurred
          fallbackSrc="/images/fallback.svg"
          as={NextImage}
        />
        <span className="text-xl font-bold md:block hidden">{siteTitle[currentLang as keyof typeof siteTitle]}</span>
      </Link>

      {/* 主导航 */}
      <nav className="w-[60%] relative flex items-center h-[48px] bg-[hsla(var(--blog-nav-background))] blog-box-shadow rounded-full">
        <div
          style={{
            display: activeIndex < 0 ? "none" : "block",
            width: `${100 / navigation.length}%`,
            transition: ".9s cubic-bezier(.98,-.65,.265,1.55),background-color .5s",
            willChange: "transform,background-color",
            boxShadow: "0 0 10px var(--blog-color-bg-end)",
            transform: `translateX(${activeIndex * 100}%)`,
          }}
          className="bg-[var(--blog-nav-link-active-color-bg)] h-full absolute left-0 rounded-full"
        ></div>
        {navigation.map((item) => (
          <Link
            key={item.name[currentLang as keyof typeof item.name]}
            href={item.href}
            className={clsx(
              `relative z-[1] flex items-center justify-center flex-1 h-full transition-colors hover:text-primary`,
              pathname === item.href ? "link-active" : undefined
            )}
          >
            {item.icon}
            <span className="ml-1 hidden md:block">{item.name[currentLang as keyof typeof item.name]}</span>
          </Link>
        ))}
      </nav>

      {/* 右侧操作区 */}
      <div className="flex items-center space-x-2">
        <SearchBar />
        <LanguageSwitcher />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
