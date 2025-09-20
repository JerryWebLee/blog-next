/**
 * 标签API测试脚本
 * 测试标签相关的所有API接口
 */

import { ApiResponse, CreateTagRequest, UpdateTagRequest, PaginatedResponseData, Tag } from "../types/blog";

const API_BASE = "http://localhost:3000/api"\;

/**
 * 测试获取标签列表
 */
async function testGetTags() {
  console.log("🧪 测试获取标签列表...");
  
  try {
    const response = await fetch(`${API_BASE}/tags?page=1&limit=10`);
    const result: ApiResponse<PaginatedResponseData<Tag>> = await response.json();
    
    if (result.success) {
      console.log("✅ 获取标签列表成功");
      console.log(`📊 总数: ${result.data?.pagination.total || 0}`);
      console.log(`📄 当前页: ${result.data?.pagination.page || 0}`);
      console.log(`📋 标签数量: ${result.data?.data.length || 0}`);
      
      if (result.data?.data.length > 0) {
        console.log("🏷️ 标签示例:");
        result.data.data.slice(0, 3).forEach((tag, index) => {
          console.log(`  ${index + 1}. ${tag.name} (${tag.slug}) - ${tag.postCount || 0} 篇文章`);
        });
      }
    } else {
      console.log("❌ 获取标签列表失败:", result.message);
    }
  } catch (error) {
    console.log("❌ 请求失败:", error);
  }
}

/**
 * 测试创建标签
 */
async function testCreateTag() {
  console.log("\n🧪 测试创建标签...");
  
  const newTag: CreateTagRequest = {
    name: `测试标签_${Date.now()}`,
    slug: `test-tag-${Date.now()}`,
    description: "这是一个测试标签",
    color: "#ff6b6b",
    isActive: true,
  };
  
  try {
    const response = await fetch(`${API_BASE}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTag),
    });
    
    const result: ApiResponse<Tag> = await response.json();
    
    if (result.success && result.data) {
      console.log("✅ 创建标签成功");
      console.log(`🏷️ 标签ID: ${result.data.id}`);
      console.log(`📝 标签名称: ${result.data.name}`);
      console.log(`🔗 标签Slug: ${result.data.slug}`);
      return result.data.id;
    } else {
      console.log("❌ 创建标签失败:", result.message);
      return null;
    }
  } catch (error) {
    console.log("❌ 请求失败:", error);
    return null;
  }
}

/**
 * 测试获取单个标签
 */
async function testGetTag(id: number) {
  console.log(`\n🧪 测试获取标签 ${id}...`);
  
  try {
    const response = await fetch(`${API_BASE}/tags/${id}`);
    const result: ApiResponse<Tag & { postCount: number }> = await response.json();
    
    if (result.success && result.data) {
      console.log("✅ 获取标签成功");
      console.log(`🏷️ 标签名称: ${result.data.name}`);
      console.log(`📝 描述: ${result.data.description || "无"}`);
      console.log(`🎨 颜色: ${result.data.color || "无"}`);
      console.log(`📊 文章数量: ${result.data.postCount || 0}`);
      console.log(`✅ 是否活跃: ${result.data.isActive ? "是" : "否"}`);
    } else {
      console.log("❌ 获取标签失败:", result.message);
    }
  } catch (error) {
    console.log("❌ 请求失败:", error);
  }
}

/**
 * 测试更新标签
 */
async function testUpdateTag(id: number) {
  console.log(`\n🧪 测试更新标签 ${id}...`);
  
  const updateData: UpdateTagRequest = {
    name: `更新的测试标签_${Date.now()}`,
    description: "这是一个更新后的测试标签",
    color: "#4ecdc4",
    isActive: false,
  };
  
  try {
    const response = await fetch(`${API_BASE}/tags/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    
    const result: ApiResponse<Tag> = await response.json();
    
    if (result.success && result.data) {
      console.log("✅ 更新标签成功");
      console.log(`🏷️ 新名称: ${result.data.name}`);
      console.log(`📝 新描述: ${result.data.description || "无"}`);
      console.log(`🎨 新颜色: ${result.data.color || "无"}`);
      console.log(`✅ 新状态: ${result.data.isActive ? "活跃" : "非活跃"}`);
    } else {
      console.log("❌ 更新标签失败:", result.message);
    }
  } catch (error) {
    console.log("❌ 请求失败:", error);
  }
}

/**
 * 测试删除标签
 */
async function testDeleteTag(id: number) {
  console.log(`\n🧪 测试删除标签 ${id}...`);
  
  try {
    const response = await fetch(`${API_BASE}/tags/${id}`, {
      method: "DELETE",
    });
    
    const result: ApiResponse<null> = await response.json();
    
    if (result.success) {
      console.log("✅ 删除标签成功");
    } else {
      console.log("❌ 删除标签失败:", result.message);
    }
  } catch (error) {
    console.log("❌ 请求失败:", error);
  }
}

/**
 * 测试搜索标签
 */
async function testSearchTags() {
  console.log("\n🧪 测试搜索标签...");
  
  try {
    const response = await fetch(`${API_BASE}/tags?search=测试&page=1&limit=5`);
    const result: ApiResponse<PaginatedResponseData<Tag>> = await response.json();
    
    if (result.success) {
      console.log("✅ 搜索标签成功");
      console.log(`🔍 搜索结果数量: ${result.data?.data.length || 0}`);
      
      if (result.data?.data.length > 0) {
        console.log("🏷️ 搜索结果:");
        result.data.data.forEach((tag, index) => {
          console.log(`  ${index + 1}. ${tag.name} (${tag.slug})`);
        });
      }
    } else {
      console.log("❌ 搜索标签失败:", result.message);
    }
  } catch (error) {
    console.log("❌ 请求失败:", error);
  }
}

/**
 * 主测试函数
 */
async function runTests() {
  console.log("🚀 开始测试标签API接口...\n");
  
  // 1. 测试获取标签列表
  await testGetTags();
  
  // 2. 测试创建标签
  const tagId = await testCreateTag();
  
  if (tagId) {
    // 3. 测试获取单个标签
    await testGetTag(tagId);
    
    // 4. 测试更新标签
    await testUpdateTag(tagId);
    
    // 5. 测试删除标签
    await testDeleteTag(tagId);
  }
  
  // 6. 测试搜索标签
  await testSearchTags();
  
  console.log("\n🎉 标签API测试完成！");
}

// 运行测试
runTests().catch(console.error);
