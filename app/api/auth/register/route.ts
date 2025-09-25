import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/config";
import { users } from "@/lib/db/schema";
import { hashPassword, isValidEmail, validatePasswordStrength } from "@/lib/utils";
import { ApiResponse } from "@/types/blog";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, displayName } = body;

    // 验证输入
    if (!username || !email || !password || !displayName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "所有字段都是必填的",
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

    // 验证密码强度
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "密码强度不符合要求",
          error: passwordValidation.errors.join("; "),
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "用户名已存在",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // 检查邮箱是否已存在
    const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "邮箱已被注册",
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const [insertResult] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      displayName,
      role: "user",
      status: "active",
      emailVerified: false,
    });

    // 获取新创建的用户信息
    const newUser = await db.select().from(users).where(eq(users.id, insertResult.insertId)).limit(1);

    // 构建响应数据（排除密码）
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "注册成功",
      data: userWithoutPassword,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("注册错误:", error);
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
