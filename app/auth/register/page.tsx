"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "请输入用户名";
    } else if (formData.username.length < 3) {
      newErrors.username = "用户名长度至少3位";
    }

    if (!formData.email.trim()) {
      newErrors.email = "请输入邮箱地址";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }

    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (formData.password.length < 8) {
      newErrors.password = "密码长度至少8位";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "请确认密码";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "请输入显示名称";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

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
        setErrors({ general: data.message || "注册失败，请稍后重试" });
      }
    } catch (error) {
      setErrors({ general: "网络错误，请稍后重试" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
        </div>

        {/* 注册卡片 */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">创建账户</h1>
              <p className="text-gray-600">注册新账户以开始使用</p>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 通用错误提示 */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* 用户名输入 */}
              <div className="space-y-2">
                <Input
                  type="text"
                  label="用户名"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  isInvalid={!!errors.username}
                  errorMessage={errors.username}
                  startContent={<User className="w-4 h-4 text-gray-400" />}
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-sm",
                    inputWrapper:
                      "border-gray-300 hover:blog-border-y-box-shadowlue-500 focus-within:blog-border-y-box-shadowlue-500",
                  }}
                />
              </div>

              {/* 显示名称输入 */}
              <div className="space-y-2">
                <Input
                  type="text"
                  label="显示名称"
                  placeholder="请输入显示名称"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  isInvalid={!!errors.displayName}
                  errorMessage={errors.displayName}
                  startContent={<User className="w-4 h-4 text-gray-400" />}
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-sm",
                    inputWrapper:
                      "border-gray-300 hover:blog-border-y-box-shadowlue-500 focus-within:blog-border-y-box-shadowlue-500",
                  }}
                />
              </div>

              {/* 邮箱输入 */}
              <div className="space-y-2">
                <Input
                  type="email"
                  label="邮箱地址"
                  placeholder="请输入邮箱地址"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-sm",
                    inputWrapper:
                      "border-gray-300 hover:blog-border-y-box-shadowlue-500 focus-within:blog-border-y-box-shadowlue-500",
                  }}
                />
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="密码"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password}
                  startContent={<Lock className="w-4 h-4 text-gray-400" />}
                  endContent={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                      {showPassword ? (
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
                />
              </div>

              {/* 确认密码输入 */}
              <div className="space-y-2">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="确认密码"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword}
                  startContent={<Lock className="w-4 h-4 text-gray-400" />}
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
                />
              </div>

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
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  已有账户？{" "}
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    立即登录
                  </Link>
                </span>
              </div>
            </form>
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
