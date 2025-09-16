import Image from "next/image";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
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
  const formatDate = (date?: Date) => {
    console.log("date", date);
    return date
      ? new Intl.DateTimeFormat("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date)
      : "未知日期";
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-default-50">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 w-full">
          {/* 分类标签 */}
          {post.category && (
            <Chip size="sm" variant="flat" color="primary" className="self-start">
              <Tag className="w-3 h-3 mr-1" />
              {post.category.name}
            </Chip>
          )}

          {/* 标题 */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* 摘要 */}
          <p className="text-small text-default-600 line-clamp-3">{post.excerpt || "暂无摘要"}</p>
        </div>
      </CardHeader>

      <CardBody className="py-2">
        {/* 特色图片 */}
        {post.featuredImage && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* 标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map((tag) => (
              <Chip key={tag.slug} size="sm" variant="flat" color="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </Chip>
            ))}
          </div>
        )}

        {/* 元信息 */}
        <div className="flex items-center justify-between text-small text-default-500">
          <div className="flex items-center gap-4">
            {/* 作者 */}
            <div className="flex items-center gap-2">
              <Avatar size="sm" icon={<User className="w-3 h-3" />} className="w-6 h-6" />
              <span>{post.author.displayName}</span>
            </div>

            {/* 发布时间 */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {/* {formatDate(post.publishedAt)} */}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 阅读量 */}
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.viewCount}
            </div>

            {/* 评论数 */}
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {post.commentCount || 0}
            </div>

            {/* 阅读时间 */}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime || 5} 分钟阅读
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-2">
        <div className="flex items-center justify-between w-full">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<Heart className="w-4 h-4" />}
            onPress={() => onLike?.()}
          >
            点赞
          </Button>

          <Button
            size="sm"
            variant="flat"
            color="default"
            endContent={<ArrowRight className="w-4 h-4" />}
            onPress={() => onView?.()}
          >
            阅读更多
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
