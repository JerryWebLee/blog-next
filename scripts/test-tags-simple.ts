/**
 * 简单的标签API测试
 */

async function testTagsAPI() {
  const baseUrl = "http://localhost:3000";

  console.log("🧪 测试标签API接口...\n");

  try {
    // 测试获取标签列表
    console.log("1. 测试获取标签列表...");
    const response = await fetch(`${baseUrl}/api/tags?page=1&limit=5`);
    const data = await response.json();

    if (data.success) {
      console.log("✅ 获取标签列表成功");
      console.log(`📊 总数: ${data.data?.pagination?.total || 0}`);
      console.log(`📋 当前页标签数: ${data.data?.data?.length || 0}`);

      if (data.data?.data?.length > 0) {
        console.log("🏷️ 标签示例:");
        data.data.data.forEach((tag: any, index: number) => {
          console.log(`  ${index + 1}. ${tag.name} (${tag.slug}) - ${tag.postCount || 0} 篇文章`);
        });
      }
    } else {
      console.log("❌ 获取标签列表失败:", data.message);
    }

    // 测试创建标签
    console.log("\n2. 测试创建标签...");
    const newTag = {
      name: `测试标签_${Date.now()}`,
      slug: `test-tag-${Date.now()}`,
      description: "这是一个测试标签",
      color: "#ff6b6b",
      isActive: true,
    };

    const createResponse = await fetch(`${baseUrl}/api/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTag),
    });

    const createData = await createResponse.json();

    if (createData.success) {
      console.log("✅ 创建标签成功");
      console.log(`🏷️ 标签ID: ${createData.data?.id}`);
      console.log(`📝 标签名称: ${createData.data?.name}`);

      // 测试删除标签
      if (createData.data?.id) {
        console.log("\n3. 测试删除标签...");
        const deleteResponse = await fetch(`${baseUrl}/api/tags/${createData.data.id}`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        if (deleteData.success) {
          console.log("✅ 删除标签成功");
        } else {
          console.log("❌ 删除标签失败:", deleteData.message);
        }
      }
    } else {
      console.log("❌ 创建标签失败:", createData.message);
    }
  } catch (error) {
    console.log("❌ 测试失败:", error);
  }

  console.log("\n🎉 测试完成！");
}

// 运行测试
testTagsAPI();
