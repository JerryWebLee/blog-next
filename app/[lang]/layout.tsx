import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";

import "@/styles/globals.scss";

import clsx from "clsx";

import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Providers } from "../providers";
import { getDictionary } from "@/lib/dictionaries";

const inter = Inter({ subsets: ["latin"] });
const urbanist = Urbanist({ subsets: ["latin"] });

// 支持的语言类型
type Locale = 'zh-CN' | 'en-US' | 'ja-JP';

// 生成静态参数
export async function generateStaticParams() {
  return [
    { lang: 'zh-CN' },
    { lang: 'en-US' },
    { lang: 'ja-JP' }
  ];
}

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const metadata: Record<string, Metadata> = {
    'zh-CN': {
      title: "荒野博客 | 在数字荒野中探索技术 - 在思考森林中寻找真理",
      description: "在数字荒野中探索技术，在思考森林中寻找真理",
      authors: [{ name: "荒野", url: "https://blog.huangye.cn" }],
      applicationName: "荒野博客",
      generator: "Next.js",
      keywords: [
        "荒野博客",
        "技术博客",
        "思考博客",
        "blog",
        "technology",
        "thinking",
        "前端开发",
        "后端开发",
        "全栈开发",
        "前端框架",
        "后端框架",
        "全栈框架",
        "前端技术",
        "后端技术",
        "全栈技术",
      ],
      robots: "none",
      viewport: { width: "device-width", initialScale: 1 },
      colorScheme: "light dark",
      openGraph: {
        title: "荒野博客",
        description: "在数字荒野中探索技术，在思考森林中寻找真理",
      },
      category: "technology",
    },
    'en-US': {
      title: "Wilderness Blog | Exploring Technology in the Digital Wilderness",
      description: "Exploring technology in the digital wilderness, seeking truth in the forest of thought",
      authors: [{ name: "Wilderness", url: "https://blog.huangye.cn" }],
      applicationName: "Wilderness Blog",
      generator: "Next.js",
      keywords: [
        "wilderness blog",
        "tech blog",
        "thinking blog",
        "blog",
        "technology",
        "thinking",
        "frontend development",
        "backend development",
        "full stack development",
        "frontend framework",
        "backend framework",
        "full stack framework",
        "frontend technology",
        "backend technology",
        "full stack technology",
      ],
      robots: "none",
      viewport: { width: "device-width", initialScale: 1 },
      colorScheme: "light dark",
      openGraph: {
        title: "Wilderness Blog",
        description: "Exploring technology in the digital wilderness, seeking truth in the forest of thought",
      },
      category: "technology",
    },
    'ja-JP': {
      title: "ワイルドネスブログ | デジタルの荒野で技術を探求",
      description: "デジタルの荒野で技術を探求し、思考の森で真実を求める",
      authors: [{ name: "ワイルドネス", url: "https://blog.huangye.cn" }],
      applicationName: "ワイルドネスブログ",
      generator: "Next.js",
      keywords: [
        "ワイルドネスブログ",
        "技術ブログ",
        "思考ブログ",
        "blog",
        "technology",
        "thinking",
        "フロントエンド開発",
        "バックエンド開発",
        "フルスタック開発",
        "フロントエンドフレームワーク",
        "バックエンドフレームワーク",
        "フルスタックフレームワーク",
        "フロントエンド技術",
        "バックエンド技術",
        "フルスタック技術",
      ],
      robots: "none",
      viewport: { width: "device-width", initialScale: 1 },
      colorScheme: "light dark",
      openGraph: {
        title: "ワイルドネスブログ",
        description: "デジタルの荒野で技術を探求し、思考の森で真実を求める",
      },
      category: "technology",
    },
  };

  return metadata[lang] || metadata['zh-CN'];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={clsx(
          urbanist.className,
          "bg-radial from-[hsla(var(--heroui-background))] to-[hsla(var(--heroui-background-1))]"
        )}
      >
        <Providers
          themeProps={{
            defaultTheme: "dark",
            attribute: "class",
            value: {
              dark: "dark",
              light: "light",
            },
          }}
        >
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
