import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";

import "@/styles/globals.scss";

import clsx from "clsx";

import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
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
  // manifest: "/manifest.json",
  openGraph: {
    title: "荒野博客",
    description: "在数字荒野中探索技术，在思考森林中寻找真理",
    // url: "https://blog.huangye.cn",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
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
