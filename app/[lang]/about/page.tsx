"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Code,
  Database,
  Github,
  Globe,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Rocket,
  Shield,
  Star,
  Twitter,
  Users,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 技术栈数据
const techStack = [
  {
    name: "Next.js 15",
    description: "React 全栈框架",
    icon: <Rocket className="h-6 w-6" />,
    color: "bg-gradient-to-br from-black to-gray-800 text-white",
    delay: "delay-0",
  },
  {
    name: "Drizzle ORM",
    description: "现代化 TypeScript ORM",
    icon: <Database className="h-6 w-6" />,
    color: "bg-gradient-to-br from-blue-600 to-blue-700 text-white",
    delay: "delay-100",
  },
  {
    name: "Tailwind CSS",
    description: "实用优先的 CSS 框架",
    icon: <Palette className="h-6 w-6" />,
    color: "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white",
    delay: "delay-200",
  },
  {
    name: "TypeScript",
    description: "类型安全的 JavaScript",
    icon: <Code className="h-6 w-6" />,
    color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    delay: "delay-300",
  },
  {
    name: "PostgreSQL",
    description: "强大的关系型数据库",
    icon: <Database className="h-6 w-6" />,
    color: "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white",
    delay: "delay-400",
  },
  {
    name: "Vercel",
    description: "现代化部署平台",
    icon: <Globe className="h-6 w-6" />,
    color: "bg-gradient-to-br from-black to-gray-800 text-white",
    delay: "delay-500",
  },
];

// 项目特色
const features = [
  {
    title: "现代化设计",
    description: "采用最新的设计趋势，提供优雅的用户体验",
    icon: <Palette className="h-8 w-8" />,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "高性能",
    description: "基于 Next.js 15 的 SSR/SSG，确保极快的加载速度",
    icon: <Zap className="h-8 w-8" />,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "类型安全",
    description: "全栈 TypeScript 支持，减少运行时错误",
    icon: <Shield className="h-8 w-8" />,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "响应式设计",
    description: "完美适配各种设备尺寸，提供一致的用户体验",
    icon: <Globe className="h-8 w-8" />,
    gradient: "from-blue-500 to-cyan-500",
  },
];

// 统计数据
const stats = [
  { label: "项目开发时间", value: "3个月", icon: <Code className="h-5 w-5" />, color: "text-blue-500" },
  { label: "技术栈数量", value: "6+", icon: <Rocket className="h-5 w-5" />, color: "text-purple-500" },
  { label: "代码行数", value: "10k+", icon: <Code className="h-5 w-5" />, color: "text-green-500" },
  { label: "组件数量", value: "20+", icon: <Star className="h-5 w-5" />, color: "text-orange-500" },
];

// 动画组件
const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 粒子背景组件
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/25 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-primary/15 rounded-full animate-ping"></div>
    </div>
  );
};

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* 粒子背景 */}
      <ParticleBackground />

      {/* Hero 区域 */}
      <section className="relative py-20 bg-gradient-to-br from-background via-background/95 to-primary/5 overflow-hidden">
        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection delay={0}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="relative mb-8 group">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl group-hover:shadow-primary/25 transition-all duration-500 group-hover:scale-105">
                  <Image
                    src="/images/logo.png"
                    alt="荒野博客"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                </div>
                {/* 光环效果 */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in">
                关于 <span className="text-primary">荒野博客</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                在数字荒野中探索技术，在思考森林中寻找真理。这是一个基于 Next.js 15 构建的现代化博客系统，
                致力于分享技术见解、开发经验和生活感悟。
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 hover:scale-105 transition-transform duration-200 hover:shadow-md"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  中国 · 北京
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 hover:scale-105 transition-transform duration-200 hover:shadow-md"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  全栈开发
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 hover:scale-105 transition-transform duration-200 hover:shadow-md"
                >
                  <Users className="h-4 w-4 mr-2" />
                  开源爱好者
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
                <Button size="lg" asChild className="group hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  <Link href="/blog" className="flex items-center">
                    浏览文章
                    <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="group hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <Link href="#contact" className="flex items-center">
                    联系我
                    <MessageCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center group">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div
                      className={`p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 ${stat.color} group-hover:shadow-lg transition-all duration-300`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div
                    className={`text-3xl font-bold mb-2 ${stat.color} group-hover:scale-105 transition-transform duration-300`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 项目介绍 */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection delay={0}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  项目介绍
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  荒野博客是一个现代化的个人博客系统，采用最新的 Web 技术栈构建，
                  旨在提供一个优雅、高效的内容创作和分享平台。
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {features.map((feature, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <Card className="p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group border-0 bg-gradient-to-br from-background to-muted/20 hover:from-primary/5 hover:to-primary/10">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${feature.gradient} text-white group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3`}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection delay={0}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                技术栈
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                采用现代化的技术栈，确保系统的高性能、可维护性和扩展性
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card
                  className={`p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group border-0 bg-gradient-to-br from-background to-muted/10 hover:from-primary/5 hover:to-primary/10 ${tech.delay}`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${tech.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl`}
                    >
                      {tech.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                        {tech.name}
                      </h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 开发历程 */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection delay={0}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  开发历程
                </h2>
                <p className="text-xl text-muted-foreground">从概念到实现，记录项目的成长轨迹</p>
              </div>
            </AnimatedSection>

            <div className="space-y-8 relative">
              {/* 时间线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20"></div>

              {[
                {
                  step: 1,
                  title: "项目规划",
                  description: "确定技术栈选择，设计系统架构，制定开发计划",
                  date: "2024年1月",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  step: 2,
                  title: "核心开发",
                  description: "实现用户认证、文章管理、分类标签等核心功能",
                  date: "2024年2月",
                  color: "from-green-500 to-green-600",
                },
                {
                  step: 3,
                  title: "UI/UX 优化",
                  description: "完善用户界面设计，优化用户体验，添加响应式支持",
                  date: "2024年3月",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  step: 4,
                  title: "测试部署",
                  description: "全面测试系统功能，部署到生产环境，持续优化",
                  date: "2024年4月",
                  color: "from-orange-500 to-orange-600",
                },
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 200}>
                  <div className="flex items-start space-x-4 group">
                    <div
                      className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1 group-hover:translate-x-2 transition-transform duration-300">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mb-2 group-hover:text-foreground/80 transition-colors duration-300">
                        {item.description}
                      </p>
                      <Badge
                        variant="outline"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                      >
                        {item.date}
                      </Badge>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section id="contact" className="py-20 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection delay={0}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                联系我
              </h2>
              <p className="text-xl text-muted-foreground mb-12">有任何问题或建议，欢迎随时联系我</p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />,
                  title: "邮箱联系",
                  description: "contact@huangye.cn",
                  button: (
                    <Button variant="outline" size="sm" className="group hover:scale-105 transition-all duration-300">
                      <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      发送邮件
                    </Button>
                  ),
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  icon: <MessageCircle className="h-8 w-8 mx-auto mb-4 text-primary" />,
                  title: "社交媒体",
                  description: "关注我的动态",
                  button: (
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="sm" className="group hover:scale-105 transition-all duration-300">
                        <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </Button>
                      <Button variant="outline" size="sm" className="group hover:scale-105 transition-all duration-300">
                        <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>
                  ),
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  icon: <MapPin className="h-8 w-8 mx-auto mb-4 text-primary" />,
                  title: "地理位置",
                  description: "中国 · 北京",
                  button: (
                    <Button variant="outline" size="sm" className="group hover:scale-105 transition-all duration-300">
                      <MapPin className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      查看位置
                    </Button>
                  ),
                  gradient: "from-green-500 to-green-600",
                },
              ].map((contact, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <Card
                    className={`p-6 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-0 bg-gradient-to-br from-background to-muted/20 hover:from-primary/5 hover:to-primary/10`}
                  >
                    <div
                      className={`p-3 rounded-full bg-gradient-to-r ${contact.gradient} text-white w-fit mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      {contact.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {contact.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 group-hover:text-foreground/80 transition-colors duration-300">
                      {contact.description}
                    </p>
                    {contact.button}
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={300}>
              <div className="bg-gradient-to-br from-background to-muted/20 rounded-lg p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  感谢访问
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  感谢您访问荒野博客！如果您觉得这个项目有趣或有任何建议，
                  欢迎通过上述方式与我联系。让我们一起在技术的道路上探索前行！
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    asChild
                    className="group hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href="/blog" className="flex items-center">
                      开始阅读文章
                      <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="group hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href="/" className="flex items-center">
                      返回首页
                      <Globe className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
