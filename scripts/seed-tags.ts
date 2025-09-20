/**
 * 标签数据填充脚本
 * 创建一些测试标签数据
 */

import { db } from "../lib/db/config";
import { tags } from "../lib/db/schema";

const sampleTags = [
  {
    name: "Next.js",
    slug: "nextjs",
    description: "React 全栈框架，用于构建现代化的 Web 应用程序",
    color: "#000000",
    isActive: true,
  },
  {
    name: "TypeScript",
    slug: "typescript",
    description: "JavaScript 的超集，提供静态类型检查",
    color: "#3178c6",
    isActive: true,
  },
  {
    name: "React",
    slug: "react",
    description: "用于构建用户界面的 JavaScript 库",
    color: "#61dafb",
    isActive: true,
  },
  {
    name: "Node.js",
    slug: "nodejs",
    description: "基于 Chrome V8 引擎的 JavaScript 运行时",
    color: "#339933",
    isActive: true,
  },
  {
    name: "数据库",
    slug: "database",
    description: "数据存储和管理系统",
    color: "#336791",
    isActive: true,
  },
  {
    name: "MySQL",
    slug: "mysql",
    description: "开源关系型数据库管理系统",
    color: "#4479a1",
    isActive: true,
  },
  {
    name: "Drizzle ORM",
    slug: "drizzle-orm",
    description: "现代化的 TypeScript ORM",
    color: "#4f46e5",
    isActive: true,
  },
  {
    name: "Tailwind CSS",
    slug: "tailwind-css",
    description: "实用优先的 CSS 框架",
    color: "#06b6d4",
    isActive: true,
  },
  {
    name: "Vercel",
    slug: "vercel",
    description: "前端部署平台",
    color: "#000000",
    isActive: true,
  },
  {
    name: "JavaScript",
    slug: "javascript",
    description: "动态编程语言",
    color: "#f7df1e",
    isActive: true,
  },
  {
    name: "CSS",
    slug: "css",
    description: "层叠样式表",
    color: "#1572b6",
    isActive: true,
  },
  {
    name: "HTML",
    slug: "html",
    description: "超文本标记语言",
    color: "#e34f26",
    isActive: true,
  },
  {
    name: "Git",
    slug: "git",
    description: "分布式版本控制系统",
    color: "#f05032",
    isActive: true,
  },
  {
    name: "GitHub",
    slug: "github",
    description: "代码托管平台",
    color: "#181717",
    isActive: true,
  },
  {
    name: "Docker",
    slug: "docker",
    description: "容器化平台",
    color: "#2496ed",
    isActive: true,
  },
  {
    name: "API",
    slug: "api",
    description: "应用程序编程接口",
    color: "#ff6b6b",
    isActive: true,
  },
  {
    name: "REST",
    slug: "rest",
    description: "表述性状态传递",
    color: "#ff6b6b",
    isActive: true,
  },
  {
    name: "GraphQL",
    slug: "graphql",
    description: "API 查询语言",
    color: "#e10098",
    isActive: true,
  },
  {
    name: "JWT",
    slug: "jwt",
    description: "JSON Web Token",
    color: "#000000",
    isActive: true,
  },
  {
    name: "认证",
    slug: "authentication",
    description: "用户身份验证",
    color: "#4caf50",
    isActive: true,
  },
];

async function seedTags() {
  console.log("🌱 开始填充标签数据...");
  
  try {
    // 检查是否已有标签数据
    const existingTags = await db.select().from(tags).limit(1);
    
    if (existingTags.length > 0) {
      console.log("⚠️ 标签数据已存在，跳过填充");
      return;
    }
    
    // 插入标签数据
    for (const tag of sampleTags) {
      await db.insert(tags).values({
        ...tag,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    console.log(`✅ 成功创建 ${sampleTags.length} 个标签`);
    
    // 验证数据
    const count = await db.select().from(tags);
    console.log(`📊 数据库中共有 ${count.length} 个标签`);
    
  } catch (error) {
    console.error("❌ 填充标签数据失败:", error);
  }
}

// 运行填充
seedTags().then(() => {
  console.log("🎉 标签数据填充完成！");
  process.exit(0);
}).catch((error) => {
  console.error("❌ 填充失败:", error);
  process.exit(1);
});
