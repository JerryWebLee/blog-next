"use client";

import { Button } from "@/components/ui/button";

export default function TestSimplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">简单HeroUI测试</h1>

      <div className="space-y-4">
        <Button variant="default">默认按钮</Button>
        <Button variant="destructive">危险按钮</Button>
        <Button variant="outline">轮廓按钮</Button>
      </div>

      <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-md">
        <p className="text-green-800">
          如果按钮正常显示，说明HeroUI Button组件工作正常！
        </p>
      </div>
    </div>
  );
}
