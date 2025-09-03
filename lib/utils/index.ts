/**
 * 通用工具函数库
 * 提供博客系统中常用的工具方法和辅助函数
 */

import { ApiResponse, PaginationParams, PaginatedResponse } from '@/types/blog';

// ==================== 分页工具 ====================

/**
 * 计算分页信息
 * @param total 总记录数
 * @param page 当前页码
 * @param limit 每页数量
 * @returns 分页信息对象
 */
export function calculatePagination(
  total: number, 
  page: number = 1, 
  limit: number = 10
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
} {
  // 确保页码和限制数量在有效范围内
  const currentPage = Math.max(1, page);
  const pageLimit = Math.max(1, Math.min(100, limit)); // 限制最大每页100条
  
  const totalPages = Math.ceil(total / pageLimit);
  const offset = (currentPage - 1) * pageLimit;
  
  return {
    page: currentPage,
    limit: pageLimit,
    total,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    offset,
  };
}

/**
 * 验证分页参数
 * @param params 分页参数
 * @returns 验证后的分页参数
 */
export function validatePaginationParams(params: PaginationParams): {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
} {
  return {
    page: Math.max(1, params.page || 1),
    limit: Math.max(1, Math.min(100, params.limit || 10)),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder === 'desc' ? 'desc' : 'asc',
  };
}

// ==================== API响应工具 ====================

/**
 * 创建成功响应
 * @param data 响应数据
 * @param message 成功消息
 * @returns 格式化的成功响应
 */
export function createSuccessResponse<T>(
  data: T, 
  message: string = '操作成功'
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 创建错误响应
 * @param message 错误消息
 * @param error 错误详情
 * @returns 格式化的错误响应
 */
export function createErrorResponse(
  message: string = '操作失败', 
  error?: string
): ApiResponse<null> {
  return {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 创建分页响应
 * @param data 数据列表
 * @param pagination 分页信息
 * @param message 响应消息
 * @returns 格式化的分页响应
 */
export function createPaginatedResponse<T>(
  data: T[], 
  pagination: any, 
  message: string = '查询成功'
): ApiResponse<PaginatedResponse<T>> {
  return createSuccessResponse(
    {
      data,
      pagination,
    },
    message
  );
}

// ==================== 字符串工具 ====================

/**
 * 生成URL友好的slug
 * @param text 原始文本
 * @returns 格式化的slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 将空格、下划线、连字符替换为单个连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

/**
 * 生成唯一标识符
 * @param prefix 前缀
 * @returns 唯一标识符
 */
export function generateUniqueId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`;
}

/**
 * 截断文本到指定长度
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param suffix 后缀
 * @returns 截断后的文本
 */
export function truncateText(
  text: string, 
  maxLength: number = 100, 
  suffix: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

// ==================== 日期时间工具 ====================

/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式化模式
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string, 
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'relative') {
    return formatRelativeDate(dateObj);
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  };
  
  if (format === 'long') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('zh-CN', options).format(dateObj);
}

/**
 * 格式化相对时间
 * @param date 日期对象
 * @returns 相对时间字符串
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '刚刚';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}天前`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}周前`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}年前`;
}

// ==================== 验证工具 ====================

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 密码强度等级
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} {
  let score = 0;
  
  // 长度检查
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // 包含数字
  if (/\d/.test(password)) score += 1;
  
  // 包含小写字母
  if (/[a-z]/.test(password)) score += 1;
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) score += 1;
  
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }
  
  return {
    isValid: score >= 3,
    strength,
    score,
  };
}

/**
 * 验证用户名格式
 * @param username 用户名
 * @returns 是否有效
 */
export function isValidUsername(username: string): boolean {
  // 用户名规则：3-20个字符，只能包含字母、数字、下划线、连字符
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

// ==================== 数组和对象工具 ====================

/**
 * 数组去重
 * @param array 原始数组
 * @param key 去重依据的键（对象数组）
 * @returns 去重后的数组
 */
export function uniqueArray<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * 数组分组
 * @param array 原始数组
 * @param key 分组依据的键
 * @returns 分组后的对象
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * 深度克隆对象
 * @param obj 原始对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

// ==================== 错误处理工具 ====================

/**
 * 安全地获取嵌套对象属性
 * @param obj 目标对象
 * @param path 属性路径
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 */
export function safeGet<T>(
  obj: any, 
  path: string, 
  defaultValue: T
): T {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }
    
    return result !== undefined ? result : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * 异步操作包装器
 * @param fn 异步函数
 * @returns 包装后的函数
 */
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<ApiResponse<R>> => {
    try {
      const result = await fn(...args);
      return createSuccessResponse(result);
    } catch (error) {
      console.error('操作失败:', error);
      return createErrorResponse(
        '操作失败', 
        error instanceof Error ? error.message : '未知错误'
      );
    }
  };
}
