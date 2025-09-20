/**
 * 单个标签API路由
 * 提供单个标签的增删改查接口
 *
 * GET /api/tags/[id] - 获取单个标签
 * PUT /api/tags/[id] - 更新标签
 * DELETE /api/tags/[id] - 删除标签
 */

import { NextRequest, NextResponse } from "next/server";
import { and, count, eq, ne } from "drizzle-orm";

import { db } from "@/lib/db/config";
import { postTags, tags } from "@/lib/db/schema";
import { ApiResponse, Tag, UpdateTagRequest } from "@/types/blog";

/**
 * GET /api/tags/[id]
 * 获取单个标签
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tagId = parseInt(id);

    if (isNaN(tagId)) {
      return NextResponse.json(
        {
          success: false,
          message: "无效的标签ID",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 查询标签
    const [tag] = await db.select().from(tags).where(eq(tags.id, tagId)).limit(1);

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          message: "标签不存在",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // 获取标签关联的文章数量
    const [postCountResult] = await db.select({ count: count() }).from(postTags).where(eq(postTags.tagId, tagId));

    const tagWithCount = {
      ...tag,
      postCount: postCountResult.count,
    };

    return NextResponse.json({
      success: true,
      data: tagWithCount,
      message: "标签获取成功",
      timestamp: new Date().toISOString(),
    } as ApiResponse<Tag & { postCount: number }>);
  } catch (error) {
    console.error("获取标签失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: "获取标签失败",
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tags/[id]
 * 更新标签
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tagId = parseInt(id);

    if (isNaN(tagId)) {
      return NextResponse.json(
        {
          success: false,
          message: "无效的标签ID",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const body: UpdateTagRequest = await request.json();

    // 检查标签是否存在
    const [existingTag] = await db.select().from(tags).where(eq(tags.id, tagId)).limit(1);

    if (!existingTag) {
      return NextResponse.json(
        {
          success: false,
          message: "标签不存在",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // 如果更新名称，检查是否与其他标签重名
    if (body.name && body.name !== existingTag.name) {
      const [duplicateName] = await db
        .select()
        .from(tags)
        .where(and(eq(tags.name, body.name), ne(tags.id, tagId)))
        .limit(1);

      if (duplicateName) {
        return NextResponse.json(
          {
            success: false,
            message: "标签名称已存在",
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }
    }

    // 如果更新slug，检查是否与其他标签重名
    if (body.slug && body.slug !== existingTag.slug) {
      const [duplicateSlug] = await db
        .select()
        .from(tags)
        .where(and(eq(tags.slug, body.slug), ne(tags.id, tagId)))
        .limit(1);

      if (duplicateSlug) {
        return NextResponse.json(
          {
            success: false,
            message: "标签slug已存在",
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }
    }

    // 更新标签
    await db
      .update(tags)
      .set({
        ...(body.name && { name: body.name }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        updatedAt: new Date(),
      })
      .where(eq(tags.id, tagId));

    // 重新查询更新后的标签
    const [updatedTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, tagId))
      .limit(1);

    return NextResponse.json({
      success: true,
      data: updatedTag,
      message: "标签更新成功",
      timestamp: new Date().toISOString(),
    } as ApiResponse<Tag>);
  } catch (error) {
    console.error("更新标签失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: "更新标签失败",
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tags/[id]
 * 删除标签
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const tagId = parseInt(id);

    if (isNaN(tagId)) {
      return NextResponse.json(
        {
          success: false,
          message: "无效的标签ID",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 检查标签是否存在
    const [existingTag] = await db.select().from(tags).where(eq(tags.id, tagId)).limit(1);

    if (!existingTag) {
      return NextResponse.json(
        {
          success: false,
          message: "标签不存在",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // 检查标签是否有关联的文章
    const [postCountResult] = await db.select({ count: count() }).from(postTags).where(eq(postTags.tagId, tagId));

    if (postCountResult.count > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `无法删除标签，该标签下还有 ${postCountResult.count} 篇文章`,
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // 删除标签
    await db.delete(tags).where(eq(tags.id, tagId));

    return NextResponse.json({
      success: true,
      message: "标签删除成功",
      timestamp: new Date().toISOString(),
    } as ApiResponse<null>);
  } catch (error) {
    console.error("删除标签失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: "删除标签失败",
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
