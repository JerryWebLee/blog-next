/**
 * 博客文章服务层
 * 实现文章的增删改查、状态管理、标签关联等核心业务逻辑
 */

import { and, asc, count, desc, eq, like, or, sql } from "drizzle-orm";

import { db } from "@/lib/db/config";
import { categories, comments, posts, postTags, tags, users } from "@/lib/db/schema";
import {
  calculatePagination,
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
  generateSlug,
  truncateText,
} from "@/lib/utils";
import { CreatePostRequest, PaginatedResponse, Post, PostQueryParams, UpdatePostRequest } from "@/types/blog";

/**
 * 文章服务类
 * 封装所有与文章相关的业务操作
 */
export class PostService {
  /**
   * 创建新文章
   * @param data 文章创建数据
   * @param authorId 作者ID
   * @returns 创建的文章信息
   */
  async createPost(data: CreatePostRequest, authorId: number): Promise<Post | null> {
    try {
      // 生成slug（如果未提供）
      const slug = data.slug || generateSlug(data.title);

      // 检查slug是否已存在
      const existingPost = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
      if (existingPost.length > 0) {
        throw new Error("文章别名已存在，请使用不同的标题或别名");
      }

      // 生成文章摘要（如果未提供）
      const excerpt = data.excerpt || truncateText(data.content, 200);

      // 创建文章记录
      await db.insert(posts).values({
        title: data.title,
        slug,
        excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        authorId,
        categoryId: data.categoryId,
        status: data.status || "draft",
        visibility: data.visibility || "public",
        password: data.password,
        allowComments: data.allowComments !== false,
        publishedAt: data.status === "published" ? new Date() : undefined,
      });

      // 获取新创建的文章ID
      const [newPost] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);

      // 如果提供了标签ID，创建标签关联
      if (data.tagIds && data.tagIds.length > 0) {
        await this.attachTagsToPost(newPost.id, data.tagIds);
      }

      // 返回完整的文章信息（包含关联数据）
      return await this.getPostById(newPost.id);
    } catch (error) {
      console.error("创建文章失败:", error);
      throw error;
    }
  }

  /**
   * 根据ID获取文章详情
   * @param id 文章ID
   * @param includeRelations 是否包含关联数据
   * @returns 文章详情
   */
  async getPostById(id: number, includeRelations: boolean = true): Promise<Post | null> {
    try {
      let query = db.select().from(posts).where(eq(posts.id, id));

      if (includeRelations) {
        // 包含作者信息
        query = query.leftJoin(users, eq(posts.authorId, users.id));
        // 包含分类信息
        query = query.leftJoin(categories, eq(posts.categoryId, categories.id));
      }

      const result = await query.limit(1);

      if (result.length === 0) {
        return null;
      }

      const post = result[0];

      // 如果包含关联数据，获取标签和评论
      if (includeRelations) {
        const [tags, comments] = await Promise.all([this.getPostTags(post.id), this.getPostComments(post.id)]);

        return {
          ...post,
          tags,
          comments,
          author: post.users,
          category: post.categories,
        } as Post;
      }

      return post as Post;
    } catch (error) {
      console.error("获取文章详情失败:", error);
      throw error;
    }
  }

  /**
   * 根据slug获取文章详情
   * @param slug 文章别名
   * @param includeRelations 是否包含关联数据
   * @returns 文章详情
   */
  async getPostBySlug(slug: string, includeRelations: boolean = true): Promise<Post | null> {
    try {
      let query = db.select().from(posts).where(eq(posts.slug, slug));

      if (includeRelations) {
        query = query.leftJoin(users, eq(posts.authorId, users.id));
        query = query.leftJoin(categories, eq(posts.categoryId, categories.id));
      }

      const result = await query.limit(1);

      if (result.length === 0) {
        return null;
      }

      const post = result[0];

      if (includeRelations) {
        const [tags, comments] = await Promise.all([this.getPostTags(post.id), this.getPostComments(post.id)]);

        return {
          ...post,
          tags,
          comments,
          author: post.users,
          category: post.categories,
        } as Post;
      }

      return post as Post;
    } catch (error) {
      console.error("根据slug获取文章失败:", error);
      throw error;
    }
  }

  /**
   * 分页查询文章列表
   * @param params 查询参数
   * @returns 分页的文章列表
   */
  async getPosts(params: PostQueryParams = {}): Promise<PaginatedResponse<Post>> {
    try {
      const { page, limit, sortBy, sortOrder } = calculatePagination(
        params.total || 0,
        params.page || 1,
        params.limit || 10
      );

      // 构建查询条件
      const conditions = [];

      // 状态过滤
      if (params.status) {
        conditions.push(eq(posts.status, params.status));
      }

      // 可见性过滤
      if (params.visibility) {
        conditions.push(eq(posts.visibility, params.visibility));
      }

      // 作者过滤
      if (params.authorId) {
        conditions.push(eq(posts.authorId, params.authorId));
      }

      // 分类过滤
      if (params.categoryId) {
        conditions.push(eq(posts.categoryId, params.categoryId));
      }

      // 搜索过滤
      if (params.search) {
        const searchCondition = or(
          like(posts.title, `%${params.search}%`),
          like(posts.content, `%${params.search}%`),
          like(posts.excerpt, `%${params.search}%`)
        );
        conditions.push(searchCondition);
      }

      // 特色文章过滤
      if (params.featured !== undefined) {
        // 这里可以根据实际需求实现特色文章的过滤逻辑
        // 例如：根据某个字段或关联表来判断
      }

      // 组合所有条件
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // 获取总数
      const totalResult = await db.select({ count: count() }).from(posts).where(whereClause);
      const total = totalResult[0]?.count || 0;

      // 计算分页信息
      const pagination = calculatePagination(total, page, limit);

      // 构建查询
      let query = db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          content: posts.content,
          featuredImage: posts.featuredImage,
          authorId: posts.authorId,
          categoryId: posts.categoryId,
          status: posts.status,
          visibility: posts.visibility,
          allowComments: posts.allowComments,
          viewCount: posts.viewCount,
          likeCount: posts.likeCount,
          publishedAt: posts.publishedAt,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          // 关联数据
          authorName: users.displayName,
          authorUsername: users.username,
          categoryName: categories.name,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(whereClause);

      // 排序
      if (sortBy) {
        const orderBy =
          sortBy === "title"
            ? posts.title
            : sortBy === "createdAt"
              ? posts.createdAt
              : sortBy === "updatedAt"
                ? posts.updatedAt
                : sortBy === "publishedAt"
                  ? posts.publishedAt
                  : sortBy === "viewCount"
                    ? posts.viewCount
                    : sortBy === "likeCount"
                      ? posts.likeCount
                      : posts.createdAt;

        query = query.orderBy(sortOrder === "desc" ? desc(orderBy) : asc(orderBy));
      } else {
        // 默认按创建时间倒序
        query = query.orderBy(desc(posts.createdAt));
      }

      // 分页
      query = query.limit(limit).offset(pagination.offset);

      const results = await query;

      // 转换结果格式
      const postsData: Post[] = results.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        content: row.content,
        featuredImage: row.featuredImage,
        authorId: row.authorId,
        categoryId: row.categoryId,
        status: row.status,
        visibility: row.visibility,
        allowComments: row.allowComments,
        viewCount: row.viewCount,
        likeCount: row.likeCount,
        publishedAt: row.publishedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        author: {
          id: row.authorId,
          username: row.authorUsername || "",
          displayName: row.authorName || "",
        } as any,
        category: row.categoryName
          ? ({
              id: row.categoryId,
              name: row.categoryName,
            } as any)
          : undefined,
      }));

      return {
        data: postsData,
        pagination,
      };
    } catch (error) {
      console.error("查询文章列表失败:", error);
      throw error;
    }
  }

  /**
   * 更新文章信息
   * @param id 文章ID
   * @param data 更新数据
   * @returns 更新后的文章
   */
  async updatePost(id: number, data: UpdatePostRequest): Promise<Post> {
    try {
      // 检查文章是否存在
      const existingPost = await this.getPostById(id, false);
      if (!existingPost) {
        throw new Error("文章不存在");
      }

      // 如果更新了标题且没有提供slug，生成新的slug
      let slug = data.slug;
      if (data.title && !data.slug) {
        slug = generateSlug(data.title);

        // 检查新slug是否与其他文章冲突
        const conflictPost = await db
          .select()
          .from(posts)
          .where(and(eq(posts.slug, slug), sql`${posts.id} != ${id}`))
          .limit(1);

        if (conflictPost.length > 0) {
          throw new Error("文章别名已存在，请使用不同的标题或别名");
        }
      }

      // 生成摘要（如果更新了内容且没有提供摘要）
      let excerpt = data.excerpt;
      if (data.content && !data.excerpt) {
        excerpt = truncateText(data.content, 200);
      }

      // 更新发布时间（如果状态改为已发布）
      let publishedAt = data.publishedAt;
      if (data.status === "published" && existingPost.status !== "published") {
        publishedAt = new Date();
      // 更新文章记录
      const [updateResult] = await db
        .update(posts)
        .set({
          title: data.title,
          slug,
          excerpt,
          content: data.content,
          featuredImage: data.featuredImage,
          categoryId: data.categoryId,
          status: data.status,
          visibility: data.visibility,
          password: data.password,
          allowComments: data.allowComments,
          publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id));
      // 如果提供了标签ID，更新标签关联
      if (data.tagIds) {
        await this.updatePostTags(id, data.tagIds);
      }

      // 返回更新后的完整文章信息
      return await this.getPostById(id);
    } catch (error) {
      console.error("更新文章失败:", error);
      throw error;
    }
  }

  /**
   * 删除文章
   * @param id 文章ID
   * @returns 删除结果
   */
  async deletePost(id: number): Promise<boolean> {
    try {
      // 检查文章是否存在
      const existingPost = await this.getPostById(id, false);
      if (!existingPost) {
        throw new Error("文章不存在");
      }

      // 删除文章标签关联
      await db.delete(postTags).where(eq(postTags.postId, id));

      // 删除文章评论
      await db.delete(comments).where(eq(comments.postId, id));

      // 删除文章
      await db.delete(posts).where(eq(posts.id, id));

      return true;
    } catch (error) {
      console.error("删除文章失败:", error);
      throw error;
    }
  }

  /**
   * 更新文章状态
   * @param id 文章ID
   * @param status 新状态
   * @returns 更新结果
   */
  async updatePostStatus(id: number, status: Post["status"]): Promise<Post> {
    try {
      const updateData: UpdatePostRequest = { status };

      // 如果状态改为已发布，设置发布时间
      if (status === "published") {
        updateData.publishedAt = new Date();
      }

      return await this.updatePost(id, updateData);
    } catch (error) {
      console.error("更新文章状态失败:", error);
      throw error;
    }
  }

  /**
   * 增加文章浏览次数
   * @param id 文章ID
   * @returns 更新结果
   */
  async incrementViewCount(id: number): Promise<boolean> {
    try {
      await db
        .update(posts)
        .set({
          viewCount: sql`${posts.viewCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id));

      return true;
    } catch (error) {
      console.error("增加浏览次数失败:", error);
      return false;
    }
  }

  /**
   * 增加文章点赞次数
   * @param id 文章ID
   * @returns 更新结果
   */
  async incrementLikeCount(id: number): Promise<boolean> {
    try {
      await db
        .update(posts)
        .set({
          likeCount: sql`${posts.likeCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id));

      return true;
    } catch (error) {
      console.error("增加点赞次数失败:", error);
      return false;
    }
  }

  /**
   * 获取文章标签
   * @param postId 文章ID
   * @returns 标签列表
   */
  private async getPostTags(postId: number) {
    try {
      const results = await db
        .select({
          id: tags.id,
          name: tags.name,
          slug: tags.slug,
          color: tags.color,
        })
        .from(postTags)
        .innerJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(postTags.postId, postId));

      return results;
    } catch (error) {
      console.error("获取文章标签失败:", error);
      return [];
    }
  }

  /**
   * 获取文章评论
   * @param postId 文章ID
   * @returns 评论列表
   */
  private async getPostComments(postId: number) {
    try {
      const results = await db
        .select({
          id: comments.id,
          content: comments.content,
          status: comments.status,
          createdAt: comments.createdAt,
          authorName: comments.authorName,
          authorEmail: comments.authorEmail,
        })
        .from(comments)
        .where(and(eq(comments.postId, postId), eq(comments.status, "approved")))
        .orderBy(desc(comments.createdAt));

      return results;
    } catch (error) {
      console.error("获取文章评论失败:", error);
      return [];
    }
  }

  /**
   * 为文章附加标签
   * @param postId 文章ID
   * @param tagIds 标签ID数组
   * @returns 操作结果
   */
  private async attachTagsToPost(postId: number, tagIds: number[]): Promise<boolean> {
    try {
      // 先删除现有的标签关联
      await db.delete(postTags).where(eq(postTags.postId, postId));

      // 创建新的标签关联
      if (tagIds.length > 0) {
        const tagRelations = tagIds.map((tagId) => ({
          postId,
          tagId,
        }));

        await db.insert(postTags).values(tagRelations);
      }

      return true;
    } catch (error) {
      console.error("附加标签失败:", error);
      throw error;
    }
  }

  /**
   * 更新文章标签
   * @param postId 文章ID
   * @param tagIds 标签ID数组
   * @returns 操作结果
   */
  private async updatePostTags(postId: number, tagIds: number[]): Promise<boolean> {
    return this.attachTagsToPost(postId, tagIds);
  }
}

// 导出服务实例
export const postService = new PostService();
