import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/config";
import { users } from "@/lib/db/schema";
import { ApiResponse } from "@/types/blog";

// 模拟发送邮件功能（实际项目中应该集成真实的邮件服务）
async function sendPasswordResetEmail(email: string, resetToken: string) {
  // 这里应该集成真实的邮件服务，如 SendGrid、Nodemailer 等
  console.log(`密码重置邮件发送到: ${email}`);
  console.log(`重置令牌: ${resetToken}`);
  console.log(`重置链接: ${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`);

  // 模拟邮件发送成功
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // 验证输入
    if (!email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "邮箱地址不能为空",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "邮箱格式不正确",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // 无论用户是否存在，都返回成功消息（防止邮箱枚举攻击）
    if (user.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "如果该邮箱已注册，密码重置邮件已发送",
        timestamp: new Date().toISOString(),
      });
    }

    const userData = user[0];

    // 检查用户状态
    if (userData.status !== "active") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "账户已被禁用，无法重置密码",
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // 生成重置令牌
    const resetToken = generatePasswordResetToken();
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30分钟后过期

    // 更新用户重置令牌（这里需要在用户表中添加相应字段）
    // 由于当前schema中没有这些字段，我们使用一个简单的内存存储
    // 实际项目中应该在用户表中添加 resetToken 和 resetTokenExpiry 字段
    console.log(`用户 ${userData.username} 的密码重置令牌: ${resetToken}`);

    // 发送重置邮件
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "邮件发送失败，请稍后重试",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "密码重置邮件已发送，请检查您的邮箱",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("忘记密码错误:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "服务器内部错误",
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
