import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";

import "@/styles/globals.scss";

import clsx from "clsx";

import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/types";
import { Providers } from "../providers";

const inter = Inter({ subsets: ["latin"] });
const urbanist = Urbanist({ subsets: ["latin"] });

// 生成静态参数
export async function generateStaticParams() {
  return [{ lang: "zh-CN" }, { lang: "en-US" }, { lang: "ja-JP" }];
}

// 生成元数据
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return dict.metadata as Metadata;
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
          urbanist.className
          // "bg-radial from-[hsla(var(--heroui-background))] to-[hsla(var(--heroui-background-1))]"
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
          <ConditionalLayout lang={lang}>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
