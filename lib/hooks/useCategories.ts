/**
 * 分类数据管理 Hook
 * 提供分类数据的获取、搜索、筛选等功能
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { Category, ApiResponse, PaginatedResponseData, CategoryQueryParams } from "@/types/blog";

interface UseCategoriesOptions {
  autoFetch?: boolean;
  limit?: number;
}

interface UseCategoriesReturn {
  categories: Category[];
  filteredCategories: Category[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  showOnlyActive: boolean;
  setSearchQuery: (query: string) => void;
  setShowOnlyActive: (show: boolean) => void;
  refetch: () => Promise<void>;
}

export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesReturn {
  const { autoFetch = true, limit = 100 } = options;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // 获取分类数据 - 不使用 useCallback 避免依赖循环
  const fetchCategories = async (params: Partial<CategoryQueryParams> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        sortBy: "sortOrder",
        sortOrder: "asc",
        ...(params.search && { search: params.search }),
        ...(params.isActive !== undefined && { isActive: params.isActive.toString() }),
      });

      const response = await fetch(`/api/categories?${queryParams}`);
      const result: ApiResponse<PaginatedResponseData<Category>> = await response.json();

      if (result.success && result.data) {
        setCategories(result.data.data);
      } else {
        setError(result.message || "获取分类数据失败");
      }
    } catch (error) {
      console.error("获取分类数据失败:", error);
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 构建层级结构
  const buildCategoryTree = useCallback((categories: Category[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // 创建分类映射
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // 构建层级关系
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(categoryWithChildren);
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }, []);

  // 筛选后的分类（构建层级结构）
  const filteredCategories = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories, buildCategoryTree]);

  // 重新获取数据
  const refetch = useCallback(async () => {
    await fetchCategories({
      search: searchQuery || undefined,
      isActive: showOnlyActive || undefined,
    });
  }, [searchQuery, showOnlyActive]);

  // 初始化数据
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch]);

  // 当搜索或筛选条件改变时重新获取数据
  useEffect(() => {
    if (autoFetch && !loading) {
      const timeoutId = setTimeout(() => {
        fetchCategories({
          search: searchQuery || undefined,
          isActive: showOnlyActive || undefined,
        });
      }, 300); // 防抖延迟

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, showOnlyActive]);

  return {
    categories,
    filteredCategories,
    loading,
    error,
    searchQuery,
    showOnlyActive,
    setSearchQuery,
    setShowOnlyActive,
    refetch,
  };
}
