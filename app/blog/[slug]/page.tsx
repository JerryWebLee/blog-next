"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Edit,
  Lock,
} from "lucide-react";
import { Post } from "@/types/blog";
import Image from "next/image";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // 获取博客详情
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/posts/${slug}?includeRelations=true`
        );
        const result = await response.json();

        if (result.success) {
          const postData = result.data;

          // 检查是否需要密码
          if (
            postData.visibility === "password" &&
            !postData.passwordVerified
          ) {
            setShowPasswordForm(true);
          }

          setPost(postData);
        } else {
          if (result.message.includes("密码")) {
            setShowPasswordForm(true);
          } else {
            alert("获取博客失败");
            router.push("/blog");
          }
        }
      } catch (error) {
        console.error("获取博客失败:", error);
        alert("获取博客失败");
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, router]);

  // 验证密码
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setShowPasswordForm(false);
        // 重新获取博客数据
        const postResponse = await fetch(
          `/api/posts/${slug}?includeRelations=true`
        );
        const postResult = await postResponse.json();
        if (postResult.success) {
          setPost(postResult.data);
        }
      } else {
        setPasswordError("密码错误，请重试");
      }
    } catch (error) {
      console.error("验证密码失败:", error);
      setPasswordError("验证失败，请重试");
    }
  };

  // 提交评论
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("请输入评论内容");
      return;
    }

    try {
      setSubmittingComment(true);

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post?.id,
          content: comment,
          authorName: "访客", // 实际应用中应该从用户认证获取
        }),
      });

      const result = await response.json();

      if (result.success) {
        setComment("");
        alert("评论提交成功！");
        // 重新获取博客数据以显示新评论
        const postResponse = await fetch(
          `/api/posts/${slug}?includeRelations=true`
        );
        const postResult = await postResponse.json();
        if (postResult.success) {
          setPost(postResult.data);
        }
      } else {
        alert(`评论提交失败: ${result.message}`);
      }
    } catch (error) {
      console.error("提交评论失败:", error);
      alert("评论提交失败，请重试");
    } finally {
      setSubmittingComment(false);
    }
  };

  // 获取状态标签颜色
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (showPasswordForm) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              需要密码访问
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  请输入访问密码
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  required
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                验证密码
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">博客不存在</p>
          <Button onClick={() => router.push("/blog")} className="mt-4">
            返回博客列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 返回按钮 */}
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      {/* 博客标题和元信息 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(post.status)}>
              {post.status === "published"
                ? "已发布"
                : post.status === "draft"
                  ? "草稿"
                  : "已归档"}
            </Badge>
            {post.visibility === "private" && (
              <Badge variant="secondary">私有</Badge>
            )}
            {post.visibility === "password" && (
              <Badge variant="outline">密码保护</Badge>
            )}
          </div>
        </div>

        {/* 特色图片 */}
        {post.featuredImage && (
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* 博客元信息 */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author?.displayName || "未知作者"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount} 次浏览</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments?.length || 0} 条评论</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>{post.likeCount} 个赞</span>
          </div>
        </div>

        {/* 分类和标签 */}
        <div className="flex items-center gap-4">
          {post.category && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">分类:</span>
              <Badge variant="outline">{post.category.name}</Badge>
            </div>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">标签:</span>
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 博客内容 */}
      <Card>
        <CardContent className="py-6">
          <div className="prose prose-lg max-w-none">
            {post.contentHtml ? (
              <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            ) : (
              <div className="whitespace-pre-wrap">{post.content}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Heart className="mr-2 h-4 w-4" />
            点赞
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            分享
          </Button>
        </div>

        {/* 编辑按钮（仅对作者显示） */}
        <Button variant="outline" size="sm" asChild>
          <a href={`/blog/manage/edit/${post.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            编辑
          </a>
        </Button>
      </div>

      {/* 评论区域 */}
      {post.allowComments && (
        <Card>
          <CardHeader>
            <CardTitle>评论</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 发表评论 */}
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">
                  发表评论
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="写下您的评论..."
                  rows={3}
                  required
                />
              </div>
              <Button type="submit" disabled={submittingComment}>
                {submittingComment ? "提交中..." : "发表评论"}
              </Button>
            </form>

            {/* 评论列表 */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">评论列表</h3>
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {comment.author?.displayName ||
                          comment.authorName ||
                          "匿名用户"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                暂无评论，成为第一个评论的人吧！
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
