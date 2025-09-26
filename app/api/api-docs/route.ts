import { NextRequest, NextResponse } from "next/server";

import { ApiScanner } from "@/lib/utils/api-scanner";

/**
 * GET /api/api-docs
 * 获取所有API接口信息
 */
export async function GET(request: NextRequest) {
  try {
    const scanner = new ApiScanner();
    const apiGroups = await scanner.scanAllApis();

    return NextResponse.json(apiGroups, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("获取API文档失败:", error);

    return NextResponse.json(
      {
        success: false,
        message: "获取API文档失败",
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
