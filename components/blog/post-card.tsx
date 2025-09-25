import { useState } from "react";
import Image from "next/image";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import dayjs from "dayjs";
import { ArrowRight, Calendar, Clock, Eye, Heart, MessageCircle, Tag, User } from "lucide-react";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    featuredImage?: string;
    author: {
      displayName: string;
      username: string;
    };
    category?: {
      name: string;
      slug: string;
    };
    tags?: Array<{
      name: string;
      slug: string;
      color?: string;
    }>;
    publishedAt?: Date;
    viewCount: number;
    commentCount?: number;
    readTime?: number;
  };
  onView?: () => void;
  onLike?: () => void;
}

export function PostCard({ post, onView, onLike }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative animate-fade-in-up blog-card-container">
      {/* 背景光效 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

      {/* 主卡片 - 使用flex布局确保高度一致 */}
      <Card
        className="blog-card relative w-full border-0 backdrop-blur-xl bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

        {/* 头部区域 - 固定高度 */}
        <CardHeader className="blog-card-header pb-2">
          <div className="flex flex-col gap-2 w-full">
            {/* 分类标签 */}
            {post.category && (
              <Chip
                size="sm"
                variant="flat"
                color="primary"
                className="self-start backdrop-blur-xl bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
              >
                <Tag className="w-3 h-3 mr-1" />
                {post.category.name}
              </Chip>
            )}

            {/* 标题 - 固定行数 */}
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
              {post.title}
            </h3>

            {/* 摘要 - 固定行数 */}
            <p className="text-small text-default-600 line-clamp-3 min-h-[4.5rem]">{post.excerpt || "暂无摘要"}</p>
          </div>
        </CardHeader>

        {/* 主体内容 - 使用flex-grow确保填充剩余空间 */}
        <CardBody className="blog-card-body py-2">
          {/* 特色图片 - 固定高度 */}
          {post.featuredImage && (
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* 图片遮罩效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          {/* 标签区域 - 固定最大高度 */}
          {post.tags && post.tags.length > 0 && (
            <div className="tag-container flex flex-wrap gap-1 mb-4">
              {post.tags.slice(0, 4).map((tag) => (
                <Chip
                  key={tag.slug}
                  size="sm"
                  variant="flat"
                  color="secondary"
                  className="text-xs backdrop-blur-xl bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : undefined,
                    color: tag.color || undefined,
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </Chip>
              ))}
              {post.tags.length > 4 && (
                <Chip
                  size="sm"
                  variant="flat"
                  color="default"
                  className="text-xs backdrop-blur-xl bg-white/10 dark:bg-black/10"
                >
                  +{post.tags.length - 4}
                </Chip>
              )}
            </div>
          )}

          {/* 元信息 - 固定在底部 */}
          <div className="meta-info mt-auto">
            <div className="flex flex-col gap-2 text-small text-default-500">
              {/* 作者和发布时间 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    icon={<User className="w-3 h-3" />}
                    className="w-6 h-6 backdrop-blur-xl bg-white/10 dark:bg-black/10"
                  />
                  <span className="truncate">{post.author.displayName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{dayjs(post.publishedAt).format("YYYY-MM-DD HH:mm:ss")}</span>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs">{post.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span className="text-xs">{post.commentCount || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{post.readTime || 5} 分钟阅读</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>

        {/* 底部按钮 - 固定在底部 */}
        <CardFooter className="blog-card-footer pt-2">
          <div className="flex items-center justify-between w-full">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />}
              onPress={() => {
                setIsLiked(!isLiked);
                onLike?.();
              }}
              className="backdrop-blur-xl bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-105"
            >
              {isLiked ? "已点赞" : "点赞"}
            </Button>

            <Button
              size="sm"
              variant="flat"
              color="default"
              endContent={<ArrowRight className="w-4 h-4" />}
              onPress={() => onView?.()}
              className="backdrop-blur-xl bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:scale-105"
            >
              阅读更多
            </Button>
          </div>
        </CardFooter>

        {/* 悬停时的光效 */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        )}
      </Card>
    </div>
  );
}
