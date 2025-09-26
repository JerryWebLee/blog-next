/**
 * 博客系统类型定义
 * 定义所有数据模型、API请求和响应的类型接口
 */

// ==================== 基础类型 ====================

/**
 * 基础实体接口
 * 所有数据库实体都应该包含这些基础字段
 */
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 分页查询参数接口
 * 用于分页查询的通用参数
 */
export interface PaginationParams {
  page?: number; // 页码，从1开始
  limit?: number; // 每页数量，默认10
  sortBy?: string; // 排序字段
  sortOrder?: "asc" | "desc"; // 排序方向
}

export interface PaginatedResponseData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * 分页响应接口
 * 包含分页信息和数据列表
 */
export interface PaginatedResponse<T> {
  data: PaginatedResponseData<T>;
  message: string;
  success: boolean;
}

/**
 * API响应接口
 * 统一的API响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean; // 请求是否成功
  message: string; // 响应消息
  data?: T; // 响应数据
  error?: string; // 错误信息
  timestamp: string; // 响应时间戳
}

// ==================== 用户相关类型 ====================

/**
 * 用户角色枚举
 */
export type UserRole = "admin" | "author" | "user";

/**
 * 用户状态枚举
 */
export type UserStatus = "active" | "inactive" | "banned";

/**
 * 用户实体接口
 */
export interface User extends BaseEntity {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: Date;
}

/**
 * 用户创建请求接口
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  role?: UserRole;
}

/**
 * 用户更新请求接口
 */
export interface UpdateUserRequest {
  displayName?: string;
  avatar?: string;
  bio?: string;
  role?: UserRole;
  status?: UserStatus;
}

/**
 * 用户登录请求接口
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 用户登录响应接口
 */
export interface LoginResponse {
  user: Omit<User, "password">;
  token: string;
  refreshToken: string;
}

// ==================== 分类相关类型 ====================

/**
 * 分类实体接口
 */
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  sortOrder: number | null;
  isActive: boolean;
  parent?: Category; // 父分类
  children?: Category[]; // 子分类
  postCount?: number; // 文章数量
}

/**
 * 分类创建请求接口
 */
export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 分类更新请求接口
 */
export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
  isActive?: boolean;
}

// ==================== 标签相关类型 ====================

/**
 * 标签实体接口
 */
export interface Tag extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isActive: boolean;
  postCount?: number; // 文章数量
}

/**
 * 标签创建请求接口
 */
export interface CreateTagRequest {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

/**
 * 标签更新请求接口
 */
export interface UpdateTagRequest {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

/**
 * 标签查询参数接口
 */
export interface TagQueryParams extends PaginationParams {
  search?: string; // 搜索关键词
  isActive?: boolean; // 是否激活
}

// ==================== 文章相关类型 ====================

/**
 * 文章状态枚举
 */
export type PostStatus = "draft" | "published" | "archived";

/**
 * 文章可见性枚举
 */
export type PostVisibility = "public" | "private" | "password";

/**
 * 文章实体接口
 */

export interface Post {
  posts: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    contentHtml: string | null;
    featuredImage: string;
    authorId: number;
    categoryId: number | null;
    status: PostStatus;
    visibility: PostVisibility;
    password: string;
    allowComments: boolean;
    viewCount: number;
    likeCount: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  };

  users: {
    id: number;
    username: string;
    email: string;
    password: string;
    displayName: string | null;
    avatar: string | null;
    bio: string | null;
    role: UserRole;
    status: UserStatus;
    emailVerified: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  categories: Category[];
  tags: Tag[];
  comments: Comment[];
  author: {
    id: number;
    username: string;
    displayName: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    role: UserRole;
    status: UserStatus;
    emailVerified: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PostData extends BaseEntity {
  allowComments: boolean;
  author: User;
  authorId: number;
  category: { id: number; name: string };
  categoryId: number;
  content: string;
  excerpt: string;
  featuredImage: string;
  likeCount: number;
  publishedAt: string | null;
  slug: string;
  status: PostStatus;
  title: string;
  viewCount: number;
  visibility: PostVisibility;
  comments: Comment[];
  readTime: number;
  tags: Tag[];
}

/**
 * 文章创建请求接口
 */
export interface CreatePostRequest {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  categoryId?: number;
  status?: PostStatus;
  visibility?: PostVisibility;
  password?: string;
  allowComments?: boolean;
  tagIds?: number[]; // 标签ID数组
}

/**
 * 文章更新请求接口
 */
export interface UpdatePostRequest {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  categoryId?: number;
  status?: PostStatus;
  visibility?: PostVisibility;
  password?: string;
  allowComments?: boolean;
  tagIds?: number[];
}

/**
 * 文章查询参数接口
 */
export interface PostQueryParams extends PaginationParams {
  status?: PostStatus;
  visibility?: PostVisibility;
  authorId?: number;
  categoryId?: number;
  tagId?: number;
  search?: string;
  featured?: boolean;
}

// ==================== 评论相关类型 ====================

/**
 * 评论状态枚举
 */
export type CommentStatus = "pending" | "approved" | "spam";

/**
 * 评论实体接口
 */
export interface Comment extends BaseEntity {
  postId: number;
  authorId?: number;
  parentId?: number;
  authorName?: string;
  authorEmail?: string;
  authorWebsite?: string;
  content: string;
  status: CommentStatus;
  ipAddress?: string;
  userAgent?: string;

  // 关联数据
  post?: Post;
  author?: User;
  parent?: Comment;
  replies?: Comment[];
}

/**
 * 评论创建请求接口
 */
export interface CreateCommentRequest {
  postId: number;
  authorId?: number;
  parentId?: number;
  authorName?: string;
  authorEmail?: string;
  authorWebsite?: string;
  content: string;
}

/**
 * 评论更新请求接口
 */
export interface UpdateCommentRequest {
  content?: string;
  status?: CommentStatus;
}

// ==================== 媒体文件相关类型 ====================

/**
 * 媒体文件实体接口
 */
export interface Media extends BaseEntity {
  filename: string;
  originalName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  uploadedBy: number;

  // 关联数据
  uploader?: User;
}

/**
 * 媒体文件上传请求接口
 */
export interface UploadMediaRequest {
  file: File;
  altText?: string;
  caption?: string;
}

// ==================== 系统设置相关类型 ====================

/**
 * 系统设置实体接口
 */
export interface Setting extends BaseEntity {
  key: string;
  value?: string;
  description?: string;
  isPublic: boolean;
}

/**
 * 系统设置更新请求接口
 */
export interface UpdateSettingRequest {
  value: string;
  description?: string;
  isPublic?: boolean;
}

// ==================== 统计数据类型 ====================

/**
 * 博客统计信息接口
 */
export interface BlogStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalViews: number;
  totalLikes: number;
  publishedPosts: number;
  draftPosts: number;
  pendingComments: number;
  activeUsers: number;
}

/**
 * 用户统计信息接口
 */
export interface UserStats {
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  totalLikes: number;
  lastPostAt?: Date;
  lastCommentAt?: Date;
}

// ==================== 搜索相关类型 ====================

/**
 * 搜索参数接口
 */
export interface SearchParams {
  query: string;
  type?: "posts" | "users" | "tags" | "categories";
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * 搜索结果接口
 */
export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters: Record<string, any>;
  suggestions?: string[];
}

/**
 * 分类查询参数接口
 */
export interface CategoryQueryParams extends PaginationParams {
  search?: string; // 搜索关键词
  isActive?: boolean; // 是否激活
  parentId?: number; // 父分类ID
}
