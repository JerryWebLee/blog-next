import { NextRequest, NextResponse } from 'next/server';
import { EnhancedApiScanner } from '@/lib/utils/api-scanner';

/**
 * GET /api/api-docs
 * 获取所有API接口信息（支持自动发现新接口）
 */
export async function GET(request: NextRequest) {
  try {
    const scanner = new EnhancedApiScanner();
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';
    
    const apiGroups = await scanner.scanAllApis(forceRefresh);
    
    // 添加扫描统计信息
    const stats = scanner.getScanStats();
    
    return NextResponse.json({
      groups: apiGroups,
      stats,
      message: 'API文档获取成功'
    }, {
      status: 200,
      headers: {
        'Cache-Control': forceRefresh ? 'no-cache, no-store, must-revalidate' : 'public, max-age=300',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('获取API文档失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '获取API文档失败',
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
