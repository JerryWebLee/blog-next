"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Eye,
  Heart,
  Lock,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";

import { message } from "@/lib/utils";
import { Post } from "@/types/blog";

export default function BlogDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ lang: string; slug: string } | null>(null);
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // 解析params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // 获取博客详情
  useEffect(() => {
    console.log("resolvedParams", resolvedParams);
    if (!resolvedParams?.slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${resolvedParams.slug}?includeRelations=true`);
        const result = await response.json();

        console.log("result", result);
        if (result.success) {
          const postData = result.data;

          // 检查是否需要密码
          if (postData.visibility === "password" && !postData.passwordVerified) {
            setShowPasswordForm(true);
          }

          setPost(postData);
        } else {
          if (result.message.includes("密码")) {
            setShowPasswordForm(true);
          } else {
            message.error("获取博客失败");
            router.push("/blog");
          }
        }
      } catch (error) {
        console.error("获取博客失败:", error);
        message.error("获取博客失败");
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams?.slug, router]);

  // 验证密码
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    try {
      const response = await fetch(`/api/posts/${resolvedParams?.slug}`, {
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
        const postResponse = await fetch(`/api/posts/${resolvedParams?.slug}?includeRelations=true`);
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
      message.warning("请输入评论内容");
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
          authorName: "访客",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setComment("");
        message.success("评论提交成功！");
        // 重新获取博客数据以显示新评论
        const postResponse = await fetch(`/api/posts/${resolvedParams?.slug}?includeRelations=true`);
        const postResult = await postResponse.json();
        if (postResult.success) {
          setPost(postResult.data);
        }
      } else {
        message.error(`评论提交失败: ${result.message}`);
      }
    } catch (error) {
      console.error("提交评论失败:", error);
      message.error("评论提交失败，请重试");
    } finally {
      setSubmittingComment(false);
    }
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-default-500">加载中...</p>
        </CardBody>
      </Card>
    );
  }

  if (showPasswordForm) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex gap-3">
          <Lock className="w-5 h-5 text-warning" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">需要密码访问</p>
            <p className="text-small text-default-500">请输入访问密码</p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="访问密码"
              type="password"
              value={password}
              onValueChange={setPassword}
              placeholder="输入密码"
              variant="bordered"
              isRequired
              errorMessage={passwordError}
              isInvalid={!!passwordError}
            />
            <Button type="submit" color="primary" className="w-full">
              验证密码
            </Button>
          </form>
        </CardBody>
      </Card>
    );
  }

  if (!post) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-default-300" />
          <p className="text-default-500">博客不存在</p>
          <Button onPress={() => router.push("/blog")} className="mt-4" color="primary">
            返回博客列表
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <Button
        variant="bordered"
        size="sm"
        onPress={() => router.back()}
        startContent={<ArrowLeft className="w-4 h-4" />}
      >
        返回
      </Button>

      {/* 博客标题和元信息 */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">{post.posts.title}</h1>
              {post.posts.excerpt && <p className="text-xl text-default-500">{post.posts.excerpt}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Chip color={getStatusColor(post.posts.status)} variant="flat">
                {post.posts.status === "published" ? "已发布" : post.posts.status === "draft" ? "草稿" : "已归档"}
              </Chip>
              {post.posts.visibility === "private" && (
                <Chip color="secondary" variant="flat">
                  私有
                </Chip>
              )}
              {post.posts.visibility === "password" && (
                <Chip color="warning" variant="flat">
                  密码保护
                </Chip>
              )}
            </div>
          </div>

          {/* 特色图片 */}
          {post.posts.featuredImage && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={post.posts.featuredImage}
                alt={post.posts.title}
                width={800}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          {/* 博客元信息 */}
          <div className="flex items-center gap-6 text-sm text-default-500">
            <div className="flex items-center gap-2">
              <Avatar size="sm" name={post.author?.displayName || "未知作者"} className="w-6 h-6" />
              <span>{post.author?.displayName || "未知作者"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.posts.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.posts.viewCount} 次浏览</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments?.length || 0} 条评论</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{post.posts.likeCount} 个赞</span>
            </div>
          </div>

          {/* 分类和标签 */}
          <div className="flex items-center gap-4">
            {post.categories && post.categories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-default-500">分类:</span>
                <div className="flex gap-2">
                  {post.categories.map((category) => (
                    <Chip key={category.slug} variant="flat" color="secondary">
                      {category.name}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-default-500">标签:</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <Chip key={tag.id} variant="flat" color="secondary">
                      {tag.name}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 博客内容 */}
      <Card>
        <CardBody className="py-6">
          <div className="prose prose-lg max-w-none">
            {post.posts.contentHtml ? (
              <div dangerouslySetInnerHTML={{ __html: post.posts.contentHtml }} />
            ) : (
              <div className="whitespace-pre-wrap">{post.posts.content}</div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="flat" color="danger" size="sm" startContent={<Heart className="w-4 h-4" />}>
            点赞
          </Button>
          <Button variant="flat" color="primary" size="sm" startContent={<Share2 className="w-4 h-4" />}>
            分享
          </Button>
        </div>

        {/* 编辑按钮 */}
        <Button
          variant="bordered"
          size="sm"
          as="a"
          href={`/blog/manage/edit/${post.id}`}
          startContent={<Edit className="w-4 h-4" />}
        >
          编辑
        </Button>
      </div>

      {/* 评论区域 */}
      {post.posts.allowComments && (
        <Card>
          <CardHeader>
            <p className="text-lg font-semibold">评论</p>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* 发表评论 */}
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <Textarea
                label="发表评论"
                placeholder="写下您的评论..."
                value={comment}
                onValueChange={setComment}
                variant="bordered"
                minRows={3}
                isRequired
              />
              <Button type="submit" color="primary" isLoading={submittingComment}>
                {submittingComment ? "提交中..." : "发表评论"}
              </Button>
            </form>

            <Divider />

            {/* 评论列表 */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">评论列表</h3>
                {post.comments.map((comment) => (
                  <Card key={comment.id} className="border-l-4 border-primary">
                    <CardBody className="py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar
                          size="sm"
                          name={comment.author?.displayName || comment.authorName || "匿名用户"}
                          className="w-6 h-6"
                        />
                        <span className="font-medium">
                          {comment.author?.displayName || comment.authorName || "匿名用户"}
                        </span>
                        <span className="text-sm text-default-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-default-300" />
                <p className="text-default-500">暂无评论，成为第一个评论的人吧！</p>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
