import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Eye, MessageCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
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
      color: string;
    }>;
    publishedAt: Date;
    viewCount: number;
    commentCount: number;
    readTime: number;
  };
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.category && (
            <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary">
              {post.category.name}
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {post.excerpt}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag.slug} href={`/tags/${tag.slug}`}>
                <Badge
                  variant="secondary"
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  style={{ backgroundColor: tag.color + "20", color: tag.color }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </Badge>
              </Link>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author.displayName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount}</span>
            </div>
            <span className="text-xs bg-muted px-2 py-1 rounded">
              {post.readTime} 分钟
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
