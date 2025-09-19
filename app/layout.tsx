import { Inter, Urbanist } from "next/font/google";
import clsx from "clsx";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });
const urbanist = Urbanist({ subsets: ["latin"] });
// 生成静态参数
export async function generateStaticParams() {
  return [{ lang: "zh-CN" }, { lang: "en-US" }, { lang: "ja-JP" }];
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={clsx(inter.className)}>
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
