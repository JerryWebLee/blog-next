"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoadingStatusPage() {
  const [status, setStatus] = useState("检查中...");

  const checkPages = async () => {
    setStatus("正在检查所有测试页面...");

    const pages = [
      { name: "导航页面", url: "/loading-nav" },
      { name: "交互式测试页面", url: "/loading-test" },
      { name: "慢速加载页面", url: "/slow-loading" },
      { name: "延迟加载页面", url: "/delayed-page" },
      { name: "演示页面", url: "/loading-demo" },
    ];

    const results = [];

    for (const page of pages) {
      try {
        const response = await fetch(page.url);
        results.push({
          name: page.name,
          status: response.ok ? "✅ 正常" : "❌ 错误",
          url: page.url,
        });
      } catch (error) {
        results.push({
          name: page.name,
          status: "❌ 错误",
          url: page.url,
        });
      }
    }

    setStatus("检查完成！");

    // 显示结果
    const resultText = results.map((r) => `${r.name}: ${r.status}`).join("\n");
    alert(resultText);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">加载UI状态检查</h1>
          <p className="text-muted-foreground text-lg">检查所有测试页面的运行状态</p>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">页面状态检查</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">点击下面的按钮检查所有测试页面的运行状态</p>
            <Button onClick={checkPages} className="w-full" size="lg">
              检查所有页面状态
            </Button>
            <p className="text-sm text-muted-foreground">状态: {status}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">测试页面列表</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">主要测试页面</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    •{" "}
                    <a href="/loading-nav" className="text-primary hover:underline">
                      导航页面
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a href="/loading-test" className="text-primary hover:underline">
                      交互式测试页面
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a href="/slow-loading" className="text-primary hover:underline">
                      慢速加载页面
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a href="/delayed-page" className="text-primary hover:underline">
                      延迟加载页面
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a href="/loading-demo" className="text-primary hover:underline">
                      演示页面
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">其他页面</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    •{" "}
                    <a href="/blog" className="text-primary hover:underline">
                      博客页面
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a href="/about" className="text-primary hover:underline">
                      关于页面
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a href="/docs" className="text-primary hover:underline">
                      文档页面
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">快速开始</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">推荐按以下顺序测试加载UI效果：</p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                访问{" "}
                <a href="/loading-nav" className="text-primary hover:underline">
                  导航页面
                </a>{" "}
                了解所有功能
              </li>
              <li>
                访问{" "}
                <a href="/loading-demo" className="text-primary hover:underline">
                  演示页面
                </a>{" "}
                查看所有加载效果
              </li>
              <li>
                访问{" "}
                <a href="/loading-test" className="text-primary hover:underline">
                  交互式测试页面
                </a>{" "}
                手动测试不同效果
              </li>
              <li>
                访问{" "}
                <a href="/slow-loading" className="text-primary hover:underline">
                  慢速加载页面
                </a>{" "}
                查看长时间加载效果
              </li>
              <li>
                访问{" "}
                <a href="/delayed-page" className="text-primary hover:underline">
                  延迟加载页面
                </a>{" "}
                模拟路由切换
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
