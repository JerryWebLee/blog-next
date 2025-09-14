"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Form } from "@heroui/react";
import { ArrowLeftIcon, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const formData = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // 注册成功，跳转到登录页面
        router.push("/auth/login?message=注册成功，请登录");
      } else {
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex overflow-y-auto pt-24 justify-center">
      <div className="container max-w-screen-sm">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Button radius="full" color="warning" variant="light" startContent={<ArrowLeftIcon />}>
              返回首页
            </Button>
          </Link>
        </div>

        {/* 注册卡片 */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">创建账户</h1>
              <p className="text-gray-400">注册新账户以开始使用</p>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <Form onSubmit={handleSubmit} className="space-y-6">
              {/* 用户名输入 */}
              <Input
                type="text"
                label={<span className="text-gray-200">用户名</span>}
                name="username"
                placeholder="请输入用户名"
                startContent={<User className="w-4 h-4 text-gray-200" />}
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-sm",
                  inputWrapper:
                    "border-gray-300 hover:blog-border-y-box-shadowlue-500 focus-within:blog-border-y-box-shadowlue-500",
                }}
                validate={(value) => {
                  if (!value) {
                    return "用户名不能为空";
                  }

                  if (value.length < 3) {
                    return "用户名长度至少3位";
                  }

                  if (value.length > 12) {
                    return "用户名长度最多12位";
                  }

                  return null;
                }}
              />

              {/* 显示名称输入 */}
              <Input
                type="text"
                label={<span className="text-gray-200">显示名称</span>}
                name="displayName"
                placeholder="请输入显示名称"
                startContent={<User className="w-4 h-4 text-gray-200" />}
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-sm",
                  inputWrapper:
                    "border-gray-300 hover:blog-border-y-box-shadowlue-500 focus-within:blog-border-y-box-shadowlue-500",
                }}
                validate={(value) => {
                  if (!value?.trim()) {
                    return "显示名称不能为空";
                  }

                  if (value.length < 3) {
                    return "显示名称长度至少3位";
                  }

                  if (value.length > 12) {
                    return "显示名称长度最多12位";
                  }

                  return null;
                }}
              />

              {/* 邮箱输入 */}
              <Input
                type="email"
                name="email"
                label={<span className="text-gray-200">邮箱地址</span>}
                placeholder="请输入邮箱地址"
                startContent={<Mail className="w-4 h-4 text-gray-200" />}
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-sm",
                  inputWrapper:
                    "border-gray-300 hover:blog-border-y-box-shadowlue-500 focus-within:blog-border-y-box-shadowlue-500",
                }}
                validate={(value) => {
                  if (!value?.trim()) {
                    return "邮箱地址不能为空";
                  }

                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim())) {
                    return "请输入有效的邮箱地址";
                  }

                  return null;
                }}
              />

              {/* 密码输入 */}
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                label={<span className="text-gray-200">密码</span>}
                placeholder="请输入密码"
                startContent={<Lock className="w-4 h-4 text-gray-200" />}
                endContent={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-200" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-200" />
                    )}
                  </button>
                }
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-sm",
                  inputWrapper:
                    "border-gray-300 hover:blog-border-y-box-shadowlue-500 focus-within:blog-border-y-box-shadowlue-500",
                }}
                validate={(value) => {
                  if (!value) {
                    return "确认密码不能为空";
                  }

                  if (value.length < 8) {
                    return "密码长度至少8位";
                  }

                  if (confirmPassword && value && value !== confirmPassword) {
                    return "两次输入的密码不一致";
                  }

                  return null;
                }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setConfirmPassword(e.target.value);
                }}
              />

              {/* 确认密码输入 */}
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                label={<span className="text-gray-200">确认密码</span>}
                placeholder="请再次输入密码"
                startContent={<Lock className="w-4 h-4 text-gray-200" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                }
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-sm",
                  inputWrapper:
                    "border-gray-300 hover:blog-border-y-box-shadowlue-500 focus-within:blog-border-y-box-shadowlue-500",
                }}
                validate={(value) => {
                  if (!value) {
                    return "确认密码不能为空";
                  }

                  if (value.length < 8) {
                    return "密码长度至少8位";
                  }

                  //  实时校验
                  if (password && value && value !== password) {
                    return "两次输入的密码不一致";
                  }

                  return null;
                }}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />

              {/* 注册按钮 */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-medium"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "注册中..." : "创建账户"}
              </Button>

              {/* 登录链接 */}
              <div className="w-full text-center">
                <span className="text-sm text-gray-600">
                  已有账户？
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    立即登录
                  </Link>
                </span>
              </div>
            </Form>
          </CardBody>
        </Card>

        {/* 底部信息 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            注册即表示您同意我们的{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              服务条款
            </Link>{" "}
            和{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              隐私政策
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
