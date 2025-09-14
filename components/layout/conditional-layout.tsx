"use client";

import { usePathname } from "next/navigation";

import { Footer } from "./footer";
import { Header } from "./header";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // 检查是否是认证页面
  const isAuthPage = pathname.startsWith("/auth/");

  if (isAuthPage) {
    // 认证页面：不显示 Header 和 Footer，使用全屏布局
    return (
      <div className="w-screen h-screen relativebg-[url('/images/login-bg.png')] bg-cover bg-center">
        <video
          src="/videos/login-bg.mp4"
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // 普通页面：显示完整的布局
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 min-h-[80vh] relative">{children}</main>
      <Footer />
    </div>
  );
}
