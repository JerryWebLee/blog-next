"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { useAuth } from "@/lib/contexts/auth-context";
import { LoginRequest } from "@/types/blog";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "请输入用户名或邮箱";
    }

    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (formData.password.length < 6) {
      newErrors.password = "密码长度至少6位";
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

    try {
      const result = await login(formData);

      if (result.success) {
        // 登录成功，跳转到首页或之前访问的页面
        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/";
        router.push(returnUrl);
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: "登录失败，请稍后重试" });
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

        {/* 登录卡片 */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">欢迎回来</h1>
              <p className="text-gray-600">登录您的账户以继续</p>
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

              {/* 用户名/邮箱输入 */}
              <div className="space-y-2">
                <Input
                  type="text"
                  label="用户名或邮箱"
                  placeholder="请输入用户名或邮箱"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  isInvalid={!!errors.username}
                  errorMessage={errors.username}
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "border-gray-300 hover:border-blue-500 focus-within:border-blue-500",
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
                    inputWrapper: "border-gray-300 hover:border-blue-500 focus-within:border-blue-500",
                  }}
                />
              </div>

              {/* 忘记密码链接 */}
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  忘记密码？
                </Link>
              </div>

              {/* 登录按钮 */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-medium"
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? "登录中..." : "登录"}
              </Button>

              {/* 注册链接 */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  还没有账户？{" "}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    立即注册
                  </Link>
                </span>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* 底部信息 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            登录即表示您同意我们的{" "}
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
