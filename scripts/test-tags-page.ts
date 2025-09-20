/**
 * 标签页面功能测试
 */

async function testTagsPage() {
  const baseUrl = "http://localhost:3000";

  console.log("🧪 测试标签页面功能...\n");

  try {
    // 测试中文标签页面
    console.log("1. 测试中文标签页面...");
    const zhResponse = await fetch(`${baseUrl}/zh-CN/tags`);
    if (zhResponse.ok) {
      console.log("✅ 中文标签页面加载成功");
      const zhHtml = await zhResponse.text();
      if (zhHtml.includes("博客标签")) {
        console.log("✅ 中文标签页面内容正确");
      } else {
        console.log("❌ 中文标签页面内容不正确");
      }
    } else {
      console.log("❌ 中文标签页面加载失败");
    }

    // 测试英文标签页面
    console.log("\n2. 测试英文标签页面...");
    const enResponse = await fetch(`${baseUrl}/en-US/tags`);
    if (enResponse.ok) {
      console.log("✅ 英文标签页面加载成功");
      const enHtml = await enResponse.text();
      if (enHtml.includes("Blog Tags")) {
        console.log("✅ 英文标签页面内容正确");
      } else {
        console.log("❌ 英文标签页面内容不正确");
      }
    } else {
      console.log("❌ 英文标签页面加载失败");
    }

    // 测试日文标签页面
    console.log("\n3. 测试日文标签页面...");
    const jaResponse = await fetch(`${baseUrl}/ja-JP/tags`);
    if (jaResponse.ok) {
      console.log("✅ 日文标签页面加载成功");
      const jaHtml = await jaResponse.text();
      if (jaHtml.includes("ブログタグ")) {
        console.log("✅ 日文标签页面内容正确");
      } else {
        console.log("❌ 日文标签页面内容不正确");
      }
    } else {
      console.log("❌ 日文标签页面加载失败");
    }

    // 测试标签API数据
    console.log("\n4. 测试标签API数据...");
    const apiResponse = await fetch(`${baseUrl}/api/tags?page=1&limit=10`);
    const apiData = await apiResponse.json();

    if (apiData.success && apiData.data?.data?.length > 0) {
      console.log("✅ 标签API数据获取成功");
      console.log(`📊 标签总数: ${apiData.data.pagination.total}`);
      console.log(`🏷️ 标签列表:`);
      apiData.data.data.forEach((tag: any, index: number) => {
        console.log(`  ${index + 1}. ${tag.name} (${tag.slug}) - ${tag.isActive ? "活跃" : "非活跃"}`);
      });
    } else {
      console.log("❌ 标签API数据获取失败");
    }
  } catch (error) {
    console.log("❌ 测试失败:", error);
  }

  console.log("\n🎉 标签页面功能测试完成！");
}

// 运行测试
testTagsPage();
