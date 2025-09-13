import Image from "next/image";
import Link from "next/link";
import { 
  Code, 
  Database, 
  Globe, 
  Heart, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Palette, 
  Rocket, 
  Shield, 
  Star, 
  Users, 
  Zap 
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon, TwitterIcon } from "@/components/icons";

// 技术栈数据
const techStack = [
  { name: "Next.js 15", description: "React 全栈框架", icon: <Rocket className="h-6 w-6" />, color: "bg-black text-white" },
  { name: "Drizzle ORM", description: "现代化 TypeScript ORM", icon: <Database className="h-6 w-6" />, color: "bg-blue-600 text-white" },
  { name: "Tailwind CSS", description: "实用优先的 CSS 框架", icon: <Palette className="h-6 w-6" />, color: "bg-cyan-500 text-white" },
  { name: "TypeScript", description: "类型安全的 JavaScript", icon: <Code className="h-6 w-6" />, color: "bg-blue-500 text-white" },
  { name: "PostgreSQL", description: "强大的关系型数据库", icon: <Database className="h-6 w-6" />, color: "bg-indigo-600 text-white" },
  { name: "Vercel", description: "现代化部署平台", icon: <Globe className="h-6 w-6" />, color: "bg-black text-white" },
];

// 项目特色
const features = [
  {
    title: "现代化设计",
    description: "采用最新的设计趋势，提供优雅的用户体验",
    icon: <Palette className="h-8 w-8" />,
  },
  {
    title: "高性能",
    description: "基于 Next.js 15 的 SSR/SSG，确保极快的加载速度",
    icon: <Zap className="h-8 w-8" />,
  },
  {
    title: "类型安全",
    description: "全栈 TypeScript 支持，减少运行时错误",
    icon: <Shield className="h-8 w-8" />,
  },
  {
    title: "响应式设计",
    description: "完美适配各种设备尺寸，提供一致的用户体验",
    icon: <Globe className="h-8 w-8" />,
  },
];

// 统计数据
const stats = [
  { label: "项目开发时间", value: "3个月", icon: <Code className="h-5 w-5" /> },
  { label: "技术栈数量", value: "6+", icon: <Rocket className="h-5 w-5" /> },
  { label: "代码行数", value: "10k+", icon: <Code className="h-5 w-5" /> },
  { label: "组件数量", value: "20+", icon: <Star className="h-5 w-5" /> },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero 区域 */}
      <section className="relative py-20 bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                <Image
                  src="/images/logo.png"
                  alt="荒野博客"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              关于 <span className="text-primary">荒野博客</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              在数字荒野中探索技术，在思考森林中寻找真理。这是一个基于 Next.js 15 构建的现代化博客系统，
              致力于分享技术见解、开发经验和生活感悟。
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                中国 · 北京
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Heart className="h-4 w-4 mr-2" />
                全栈开发
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                开源爱好者
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/blog">
                  浏览文章
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#contact">
                  联系我
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2 text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 项目介绍 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">项目介绍</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                荒野博客是一个现代化的个人博客系统，采用最新的 Web 技术栈构建，
                旨在提供一个优雅、高效的内容创作和分享平台。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">技术栈</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              采用现代化的技术栈，确保系统的高性能、可维护性和扩展性
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${tech.color}`}>
                    {tech.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 开发历程 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">开发历程</h2>
              <p className="text-xl text-muted-foreground">
                从概念到实现，记录项目的成长轨迹
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">项目规划</h3>
                  <p className="text-muted-foreground mb-2">
                    确定技术栈选择，设计系统架构，制定开发计划
                  </p>
                  <Badge variant="outline">2024年1月</Badge>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">核心开发</h3>
                  <p className="text-muted-foreground mb-2">
                    实现用户认证、文章管理、分类标签等核心功能
                  </p>
                  <Badge variant="outline">2024年2月</Badge>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">UI/UX 优化</h3>
                  <p className="text-muted-foreground mb-2">
                    完善用户界面设计，优化用户体验，添加响应式支持
                  </p>
                  <Badge variant="outline">2024年3月</Badge>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">测试部署</h3>
                  <p className="text-muted-foreground mb-2">
                    全面测试系统功能，部署到生产环境，持续优化
                  </p>
                  <Badge variant="outline">2024年4月</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">联系我</h2>
            <p className="text-xl text-muted-foreground mb-12">
              有任何问题或建议，欢迎随时联系我
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">邮箱联系</h3>
                <p className="text-muted-foreground mb-4">contact@huangye.cn</p>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  发送邮件
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <MessageCircle className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">社交媒体</h3>
                <p className="text-muted-foreground mb-4">关注我的动态</p>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm">
                    <TwitterIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <GithubIcon className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <MapPin className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">地理位置</h3>
                <p className="text-muted-foreground mb-4">中国 · 北京</p>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  查看位置
                </Button>
              </Card>
            </div>

            <div className="bg-background rounded-lg p-8 border">
              <h3 className="text-2xl font-bold mb-4">感谢访问</h3>
              <p className="text-muted-foreground mb-6">
                感谢您访问荒野博客！如果您觉得这个项目有趣或有任何建议，
                欢迎通过上述方式与我联系。让我们一起在技术的道路上探索前行！
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/blog">
                    开始阅读文章
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/">
                    返回首页
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
