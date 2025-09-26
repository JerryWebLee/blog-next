import fs from "fs";
import path from "path";

/**
 * 增强版API接口信息接口
 */
export interface ApiEndpoint {
  method: string;
  path: string;
  description?: string;
  parameters?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses?: ApiResponse[];
  examples?: ApiExample[];
  tags?: string[];
  deprecated?: boolean;
  version?: string;
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  location: "query" | "path" | "header";
  example?: any;
}

export interface ApiRequestBody {
  type: string;
  required: boolean;
  description?: string;
  schema?: any;
  example?: any;
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: any;
  example?: any;
}

export interface ApiExample {
  name: string;
  description?: string;
  request?: {
    headers?: Record<string, string>;
    body?: any;
  };
  response?: {
    status: number;
    body: any;
  };
}

export interface ApiGroup {
  name: string;
  description?: string;
  endpoints: ApiEndpoint[];
  version?: string;
  lastUpdated?: string;
}

/**
 * 增强版API扫描器 - 支持自动发现新API接口
 */
export class EnhancedApiScanner {
  private apiDir: string;
  private cache: Map<string, { timestamp: number; data: ApiGroup[] }> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5分钟缓存

  constructor(apiDir: string = "app/api") {
    this.apiDir = apiDir;
  }

  /**
   * 扫描所有API接口（带缓存优化）
   */
  async scanAllApis(forceRefresh: boolean = false): Promise<ApiGroup[]> {
    const cacheKey = "all-apis";
    const now = Date.now();

    // 检查缓存
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (now - cached.timestamp < this.cacheTimeout) {
        console.log("使用缓存的API数据");
        return cached.data;
      }
    }

    console.log("开始扫描API接口...");
    const groups: ApiGroup[] = [];

    try {
      const apiPath = path.join(process.cwd(), this.apiDir);
      const entries = fs.readdirSync(apiPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const group = await this.scanApiGroup(entry.name, apiPath);
          if (group) {
            groups.push(group);
          }
        }
      }

      // 更新缓存
      this.cache.set(cacheKey, { timestamp: now, data: groups });
      console.log(
        `扫描完成，发现 ${groups.length} 个API组，共 ${groups.reduce((sum, g) => sum + g.endpoints.length, 0)} 个接口`
      );
    } catch (error) {
      console.error("扫描API目录失败:", error);
    }

    return groups;
  }

  /**
   * 扫描单个API组
   */
  private async scanApiGroup(groupName: string, basePath: string): Promise<ApiGroup | null> {
    const groupPath = path.join(basePath, groupName);
    const endpoints: ApiEndpoint[] = [];

    try {
      await this.scanDirectory(groupPath, groupName, endpoints);
    } catch (error) {
      console.error(`扫描API组 ${groupName} 失败:`, error);
      return null;
    }

    if (endpoints.length === 0) {
      return null;
    }

    return {
      name: groupName,
      description: this.getGroupDescription(groupName),
      endpoints,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * 递归扫描目录（支持更多文件类型）
   */
  private async scanDirectory(dirPath: string, baseGroup: string, endpoints: ApiEndpoint[]): Promise<void> {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // 递归扫描子目录
        await this.scanDirectory(fullPath, baseGroup, endpoints);
      } else if (this.isApiFile(entry.name)) {
        // 支持多种API文件格式
        const apiPath = this.getApiPath(fullPath, baseGroup);
        const fileEndpoints = await this.parseApiFile(fullPath, apiPath);
        if (fileEndpoints && fileEndpoints.length > 0) {
          endpoints.push(...fileEndpoints);
        }
      }
    }
  }

  /**
   * 判断是否为API文件
   */
  private isApiFile(fileName: string): boolean {
    const apiFilePatterns = ["route.ts", "route.js", "index.ts", "index.js", "api.ts", "api.js"];
    return apiFilePatterns.includes(fileName);
  }

  /**
   * 解析API文件
   */
  private async parseApiFile(filePath: string, apiPath: string): Promise<ApiEndpoint[]> {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const endpoints: ApiEndpoint[] = [];

      // 解析HTTP方法
      const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];

      for (const method of httpMethods) {
        const methodRegex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`, "g");
        if (methodRegex.test(content)) {
          const endpoint = this.parseEndpoint(content, method, apiPath, filePath);
          if (endpoint) {
            endpoints.push(endpoint);
          }
        }
      }

      return endpoints;
    } catch (error) {
      console.error(`解析文件 ${filePath} 失败:`, error);
      return [];
    }
  }

  /**
   * 解析单个接口（增强版）
   */
  private parseEndpoint(content: string, method: string, apiPath: string, filePath: string): ApiEndpoint | null {
    // 提取注释中的描述
    const methodRegex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`, "g");
    const methodMatch = methodRegex.exec(content);

    let description: string | undefined;
    let tags: string[] = [];
    let deprecated = false;
    let version: string | undefined;

    if (methodMatch) {
      // 查找该函数前的注释
      const beforeMethod = content.substring(0, methodMatch.index);
      const commentMatch = beforeMethod.match(/\/\*\*([\s\S]*?)\*\/\s*$/m);
      if (commentMatch) {
        const commentInfo = this.extractCommentInfo(commentMatch[1]);
        description = commentInfo.description;
        tags = commentInfo.tags;
        deprecated = commentInfo.deprecated;
        version = commentInfo.version;
      }
    }

    // 如果没有找到注释，使用智能描述生成
    if (!description) {
      description = this.generateSmartDescription(method, apiPath, filePath);
    }

    // 提取参数信息
    const parameters = this.extractParameters(content, apiPath);

    // 提取请求体信息
    const requestBody = this.extractRequestBody(content);

    // 提取响应信息
    const responses = this.extractResponses(content);

    // 生成示例
    const examples = this.generateExamples(method, apiPath, parameters, requestBody);

    return {
      method,
      path: apiPath,
      description,
      parameters,
      requestBody,
      responses,
      examples,
      tags,
      deprecated,
      version,
    };
  }

  /**
   * 提取注释信息（增强版）
   */
  private extractCommentInfo(comment: string): {
    description?: string;
    tags: string[];
    deprecated: boolean;
    version?: string;
  } {
    const lines = comment.split("\n");
    let description: string | undefined;
    const tags: string[] = [];
    let deprecated = false;
    let version: string | undefined;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("*") && !trimmed.startsWith("/") && !trimmed.includes("import")) {
        const cleanLine = trimmed.replace(/^\*\s*/, "");

        if (cleanLine.startsWith("@tag ")) {
          tags.push(cleanLine.replace("@tag ", ""));
        } else if (cleanLine.startsWith("@deprecated")) {
          deprecated = true;
        } else if (cleanLine.startsWith("@version ")) {
          version = cleanLine.replace("@version ", "");
        } else if (!description && !cleanLine.startsWith("@")) {
          description = cleanLine;
        }
      }
    }

    return { description, tags, deprecated, version };
  }

  /**
   * 智能描述生成（增强版）
   */
  private generateSmartDescription(method: string, apiPath: string, filePath: string): string {
    // 根据文件路径推断功能
    const pathSegments = apiPath.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    // 特殊路径处理
    if (apiPath.includes("/auth/login")) return "用户登录";
    if (apiPath.includes("/auth/register")) return "用户注册";
    if (apiPath.includes("/auth/forgot-password")) return "忘记密码";
    if (apiPath.includes("/auth/reset-password")) return "重置密码";
    if (apiPath.includes("/posts/{id}/view")) return "记录文章浏览";
    if (apiPath.includes("/api-docs")) return "获取API文档";
    if (apiPath.includes("/proxy")) return "代理请求";
    if (apiPath.includes("/seed")) return "数据填充";
    if (apiPath.includes("/test-db")) return "测试数据库连接";
    if (apiPath.includes("/test-env")) return "测试环境变量";

    // 根据路径模式生成描述
    const resourceMap: Record<string, string> = {
      posts: "文章",
      categories: "分类",
      tags: "标签",
      users: "用户",
      comments: "评论",
      media: "媒体",
      settings: "设置",
      notifications: "通知",
      analytics: "分析",
      reports: "报告",
    };

    const resource = pathSegments.find((seg) => resourceMap[seg]);
    const resourceName = resource ? resourceMap[resource] : "资源";

    // 根据HTTP方法生成动作
    const actionMap: Record<string, string> = {
      GET: apiPath.includes("/{id}") ? `获取${resourceName}详情` : `获取${resourceName}列表`,
      POST: apiPath.includes("/{id}") ? `创建${resourceName}操作` : `创建${resourceName}`,
      PUT: `更新${resourceName}`,
      DELETE: `删除${resourceName}`,
      PATCH: `部分更新${resourceName}`,
    };

    return actionMap[method] || `${method} ${resourceName}`;
  }

  /**
   * 提取参数信息（增强版）
   */
  private extractParameters(content: string, apiPath: string): ApiParameter[] {
    const parameters: ApiParameter[] = [];

    // 提取路径参数
    const pathParams = apiPath.match(/\[([^\]]+)\]/g);
    if (pathParams) {
      for (const param of pathParams) {
        const paramName = param.replace(/[\[\]]/g, "");
        parameters.push({
          name: paramName,
          type: "string",
          required: true,
          description: `${paramName}参数`,
          location: "path",
          example: this.generateParameterExample(paramName),
        });
      }
    }

    // 提取查询参数
    const queryParamMatches = content.match(/searchParams\.get\(["']([^"']+)["']\)/g);
    if (queryParamMatches) {
      for (const match of queryParamMatches) {
        const paramName = match.match(/searchParams\.get\(["']([^"']+)["']\)/)?.[1];
        if (paramName) {
          parameters.push({
            name: paramName,
            type: "string",
            required: false,
            description: `查询参数: ${paramName}`,
            location: "query",
            example: this.generateParameterExample(paramName),
          });
        }
      }
    }

    return parameters;
  }

  /**
   * 生成参数示例
   */
  private generateParameterExample(paramName: string): any {
    const exampleMap: Record<string, any> = {
      id: 1,
      page: 1,
      limit: 10,
      search: "搜索关键词",
      status: "active",
      type: "public",
      category: "技术",
      tag: "javascript",
    };
    return exampleMap[paramName] || "示例值";
  }

  /**
   * 提取请求体信息（增强版）
   */
  private extractRequestBody(content: string): ApiRequestBody | undefined {
    if (content.includes("await request.json()")) {
      return {
        type: "application/json",
        required: true,
        description: "JSON格式的请求体",
        example: this.generateRequestBodyExample(content),
      };
    }
    return undefined;
  }

  /**
   * 生成请求体示例
   */
  private generateRequestBodyExample(content: string): any {
    // 根据文件内容推断请求体结构
    if (content.includes("CreatePostRequest")) {
      return {
        title: "示例文章标题",
        content: "这是文章内容...",
        excerpt: "文章摘要",
        status: "published",
        visibility: "public",
      };
    } else if (content.includes("CreateCategoryRequest")) {
      return {
        name: "示例分类",
        slug: "example-category",
        description: "分类描述",
      };
    } else if (content.includes("CreateTagRequest")) {
      return {
        name: "示例标签",
        slug: "example-tag",
        description: "标签描述",
        color: "#ff0000",
      };
    }
    return {};
  }

  /**
   * 提取响应信息（增强版）
   */
  private extractResponses(content: string): ApiResponse[] {
    const responses: ApiResponse[] = [];

    // 提取状态码
    const statusMatches = content.match(/status:\s*(\d+)/g);
    if (statusMatches) {
      for (const match of statusMatches) {
        const status = parseInt(match.replace("status:", "").trim());
        responses.push({
          status,
          description: this.getStatusDescription(status),
          example: this.generateResponseExample(status),
        });
      }
    }

    // 默认响应
    if (responses.length === 0) {
      responses.push({
        status: 200,
        description: "成功响应",
        example: { success: true, message: "操作成功" },
      });
    }

    return responses;
  }

  /**
   * 生成响应示例
   */
  private generateResponseExample(status: number): any {
    const baseResponse = {
      success: true,
      message: "操作成功",
      timestamp: new Date().toISOString(),
    };

    if (status >= 400) {
      return {
        success: false,
        message: "操作失败",
        error: "错误详情",
        timestamp: new Date().toISOString(),
      };
    }

    return baseResponse;
  }

  /**
   * 生成API示例（增强版）
   */
  private generateExamples(
    method: string,
    apiPath: string,
    parameters: ApiParameter[],
    requestBody?: ApiRequestBody
  ): ApiExample[] {
    const examples: ApiExample[] = [];

    // 生成基本示例
    const example: ApiExample = {
      name: "基本示例",
      description: `${method} ${apiPath} 的基本使用示例`,
    };

    // 生成请求示例
    if (method !== "GET") {
      example.request = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (requestBody) {
        example.request.body = requestBody.example || this.generateRequestBodyExample("");
      }
    }

    // 生成响应示例
    example.response = {
      status: 200,
      body: this.generateResponseExample(200),
    };

    examples.push(example);

    return examples;
  }

  /**
   * 获取API路径
   */
  private getApiPath(filePath: string, baseGroup: string): string {
    const relativePath = path.relative(path.join(process.cwd(), this.apiDir), filePath);
    const pathParts = relativePath.split(path.sep);

    // 移除文件名，只保留路径部分
    pathParts.pop();

    // 构建API路径
    let apiPath = "/" + pathParts.join("/");

    // 处理动态路由参数
    apiPath = apiPath.replace(/\[([^\]]+)\]/g, "{$1}");

    return apiPath;
  }

  /**
   * 获取组描述（增强版）
   */
  private getGroupDescription(groupName: string): string {
    const descriptions: Record<string, string> = {
      auth: "用户认证相关接口",
      posts: "文章管理相关接口",
      categories: "分类管理相关接口",
      tags: "标签管理相关接口",
      comments: "评论管理相关接口",
      media: "媒体文件管理相关接口",
      users: "用户管理相关接口",
      settings: "系统设置相关接口",
      proxy: "代理接口",
      seed: "数据填充接口",
      "test-db": "数据库测试接口",
      "test-env": "环境测试接口",
      "api-docs": "API文档相关接口",
      notifications: "通知相关接口",
      analytics: "数据分析相关接口",
      reports: "报告相关接口",
      uploads: "文件上传相关接口",
      search: "搜索相关接口",
    };

    return descriptions[groupName] || `${groupName}相关接口`;
  }

  /**
   * 获取状态码描述
   */
  private getStatusDescription(status: number): string {
    const descriptions: Record<number, string> = {
      200: "成功",
      201: "创建成功",
      400: "请求参数错误",
      401: "未授权",
      403: "禁止访问",
      404: "资源不存在",
      409: "冲突",
      422: "参数验证失败",
      429: "请求过于频繁",
      500: "服务器内部错误",
      502: "网关错误",
      503: "服务不可用",
    };

    return descriptions[status] || `HTTP ${status}`;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取扫描统计信息
   */
  getScanStats(): { totalGroups: number; totalEndpoints: number; lastScan: string } {
    const allApis = this.cache.get("all-apis");
    if (!allApis) {
      return { totalGroups: 0, totalEndpoints: 0, lastScan: "未扫描" };
    }

    const totalEndpoints = allApis.data.reduce((sum, group) => sum + group.endpoints.length, 0);
    return {
      totalGroups: allApis.data.length,
      totalEndpoints,
      lastScan: new Date(allApis.timestamp).toLocaleString(),
    };
  }
}
