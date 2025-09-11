import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";

import "@/styles/globals.scss";

import clsx from "clsx";

import { Providers } from "../providers";

const inter = Inter({ subsets: ["latin"] });
const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "用户认证 | 荒野博客",
  description: "登录、注册、密码重置 - 荒野博客",
  robots: "noindex, nofollow", // 认证页面不需要被搜索引擎索引
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={clsx(urbanist.className, "bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen")}>
        <Providers
          themeProps={{
            defaultTheme: "light", // 认证页面使用浅色主题
            attribute: "class",
            value: {
              dark: "dark",
              light: "light",
            },
          }}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
