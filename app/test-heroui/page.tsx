"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function TestHeroUIPage() {
  const [selectedValue, setSelectedValue] = useState("option1");

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">HeroUI组件测试页面</h1>

      {/* Button组件测试 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Button组件测试</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="default">默认按钮</Button>
          <Button variant="destructive">危险按钮</Button>
          <Button variant="outline">轮廓按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
          <Button variant="link">链接按钮</Button>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Button size="sm">小按钮</Button>
          <Button size="default">默认大小</Button>
          <Button size="lg">大按钮</Button>
          <Button size="icon">🔍</Button>
        </div>
      </div>

      {/* Select组件测试 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Select组件测试</h2>
        <div className="w-64">
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger>
              <SelectValue placeholder="选择选项" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">选项 1</SelectItem>
              <SelectItem value="option2">选项 2</SelectItem>
              <SelectItem value="option3">选项 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p>当前选择: {selectedValue}</p>
      </div>

      {/* DropdownMenu组件测试 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">DropdownMenu组件测试</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">打开菜单</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>菜单项 1</DropdownMenuItem>
            <DropdownMenuItem>菜单项 2</DropdownMenuItem>
            <DropdownMenuItem>菜单项 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Avatar组件测试 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Avatar组件测试</h2>
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="用户头像"
            />
            <AvatarFallback>用户</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Label组件测试 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Label组件测试</h2>
        <div className="w-64 space-y-2">
          <Label htmlFor="email">邮箱地址</Label>
          <input
            id="email"
            type="email"
            placeholder="输入邮箱地址"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 状态显示 */}
      <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-md">
        <h3 className="text-lg font-semibold text-green-800">✅ 测试结果</h3>
        <p className="text-green-700">
          如果所有组件都正常显示，说明HeroUI迁移成功！
        </p>
      </div>
    </div>
  );
}
