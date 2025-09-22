#!/usr/bin/env tsx

/**
 * 简化版数据库重置脚本
 * 用于清空和重新初始化数据库（不包含备份功能）
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { sql } from "drizzle-orm";

import { db } from "../lib/db/config";
import { categories, comments, media, posts, settings, tags, users } from "../lib/db/schema";

/**
 * 读取环境变量文件
 */
function loadEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const env: Record<string, string> = {};

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        env[key] = valueParts.join("=");
      }
    }
  });

  return env;
}

/**
 * 加载环境变量
 */
const env = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
  ...loadEnvFile(".env.development"),
  ...process.env,
};

const dbConfig = {
  host: env.DB_HOST || "localhost",
  port: parseInt(env.DB_PORT || "3306"),
  user: env.DB_USER || "root",
  password: env.DB_PASSWORD || "",
  database: env.DB_NAME || "blog_system",
};

/**
 * 清空数据库
 */
async function clearDatabase() {
  console.log("🧹 开始清空数据库...");

  try {
    // 禁用外键检查
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

    // 按依赖关系顺序清空表
    await db.execute(sql`TRUNCATE TABLE ${posts}`);
    await db.execute(sql`TRUNCATE TABLE ${comments}`);
    await db.execute(sql`TRUNCATE TABLE ${media}`);
    await db.execute(sql`TRUNCATE TABLE ${tags}`);
    await db.execute(sql`TRUNCATE TABLE ${categories}`);
    await db.execute(sql`TRUNCATE TABLE ${users}`);
    await db.execute(sql`TRUNCATE TABLE ${settings}`);

    // 清空迁移表
    await db.execute(sql`TRUNCATE TABLE drizzle_migrations`);

    // 重新启用外键检查
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

    console.log("✅ 数据库清空完成");
  } catch (error) {
    console.error("❌ 数据库清空失败:", error);
    throw error;
  }
}

/**
 * 重新生成迁移文件
 */
async function generateMigrations() {
  console.log("📝 重新生成迁移文件...");

  try {
    // 删除现有迁移文件
    const drizzleDir = path.join(process.cwd(), "drizzle");
    if (fs.existsSync(drizzleDir)) {
      fs.rmSync(drizzleDir, { recursive: true, force: true });
    }

    // 生成新的迁移文件
    execSync("pnpm db:generate", { stdio: "inherit" });

    console.log("✅ 迁移文件生成完成");
  } catch (error) {
    console.error("❌ 迁移文件生成失败:", error);
    throw error;
  }
}

/**
 * 执行数据库迁移
 */
async function runMigrations() {
  console.log("🚀 执行数据库迁移...");

  try {
    execSync("pnpm db:migrate", { stdio: "inherit" });
    console.log("✅ 数据库迁移完成");
  } catch (error) {
    console.error("❌ 数据库迁移失败:", error);
    throw error;
  }
}

/**
 * 填充种子数据
 */
async function seedDatabase() {
  console.log("🌱 填充种子数据...");

  try {
    execSync("pnpm db:seed", { stdio: "inherit" });
    console.log("✅ 种子数据填充完成");
  } catch (error) {
    console.error("❌ 种子数据填充失败:", error);
    throw error;
  }
}

/**
 * 验证数据库状态
 */
async function verifyDatabase() {
  console.log("🔍 验证数据库状态...");

  try {
    // 测试数据库连接
    const [result] = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ 数据库连接正常");

    // 检查表是否存在
    const [tables] = await db.execute(sql`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ${dbConfig.database}
    `);

    console.log("📊 数据库表列表:");
    (tables as any[]).forEach((table: any) => {
      console.log(`   - ${table.TABLE_NAME}`);
    });

    console.log("✅ 数据库验证完成");
  } catch (error) {
    console.error("❌ 数据库验证失败:", error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log("🔄 开始数据库重置流程...");
  console.log("=".repeat(60));

  try {
    // 1. 清空数据库
    await clearDatabase();

    // 2. 重新生成迁移文件
    await generateMigrations();

    // 3. 执行数据库迁移
    await runMigrations();

    // 4. 填充种子数据
    await seedDatabase();

    // 5. 验证数据库状态
    await verifyDatabase();

    console.log("\n🎉 数据库重置完成！");
    console.log("💡 您现在可以启动应用程序并查看全新的数据库");
  } catch (error) {
    console.error("\n💥 数据库重置失败:", error);
    process.exit(1);
  }
}

/**
 * 运行重置脚本
 */
if (require.main === module) {
  main().catch((error) => {
    console.error("\n💥 程序执行失败:", error);
    process.exit(1);
  });
}
