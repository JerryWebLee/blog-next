import fs from "fs";
import path from "path";

/**
 * API接口信息接口
 */
export interface ApiEndpoint {
  method: string;
  path: string;
  description?: string;
  parameters?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses?: ApiResponse[];
  examples?: ApiExample[];
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  location: "query" | "path" | "header";
}

export interface ApiRequestBody {
  type: string;
  required: boolean;
  description?: string;
  schema?: any;
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: any;
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
}

/**
 * 扫描API目录并解析接口信息
 */
export class ApiScanner {
  private apiDir: string;

  constructor(apiDir: string = "app/api") {
    this.apiDir = apiDir;
  }

  /**
   * 扫描所有API接口
   */
  async scanAllApis(): Promise<ApiGroup[]> {
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
    };
  }

  /**
   * 递归扫描目录
   */
  private async scanDirectory(dirPath: string, baseGroup: string, endpoints: ApiEndpoint[]): Promise<void> {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // 递归扫描子目录
        await this.scanDirectory(fullPath, baseGroup, endpoints);
      } else if (entry.name === "route.ts") {
        // 找到route.ts文件，解析API接口
        const apiPath = this.getApiPath(fullPath, baseGroup);
        const endpoint = await this.parseRouteFile(fullPath, apiPath);
        if (endpoint) {
          endpoints.push(endpoint);
        }
      }
    }
  }

  /**
   * 解析route.ts文件
   */
  private async parseRouteFile(filePath: string, apiPath: string): Promise<ApiEndpoint | null> {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const endpoints: ApiEndpoint[] = [];

      // 解析HTTP方法
      const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];

      for (const method of httpMethods) {
        const methodRegex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`, "g");
        if (methodRegex.test(content)) {
          const endpoint = this.parseEndpoint(content, method, apiPath);
          if (endpoint) {
            endpoints.push(endpoint);
          }
        }
      }

      // 如果找到多个方法，返回第一个（通常一个route.ts文件只处理一个路径的多种方法）
      return endpoints.length > 0 ? endpoints[0] : null;
    } catch (error) {
      console.error(`解析文件 ${filePath} 失败:`, error);
      return null;
    }
  }

  /**
   * 解析单个接口
   */
  private parseEndpoint(content: string, method: string, apiPath: string): ApiEndpoint | null {
    // 提取注释中的描述
    const commentMatch = content.match(/\/\*\*([\s\S]*?)\*\/\s*export\s+async\s+function\s+[A-Z]+/);
    const description = commentMatch ? this.extractDescription(commentMatch[1]) : undefined;

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
    };
  }

  /**
   * 提取描述信息
   */
  private extractDescription(comment: string): string | undefined {
    const lines = comment.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("*") && !trimmed.startsWith("/")) {
        return trimmed.replace(/^\*\s*/, "");
      }
    }
    return undefined;
  }

  /**
   * 提取参数信息
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
        });
      }
    }

    // 提取查询参数（通过searchParams.get()调用）
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
          });
        }
      }
    }

    return parameters;
  }

  /**
   * 提取请求体信息
   */
  private extractRequestBody(content: string): ApiRequestBody | undefined {
    if (content.includes("await request.json()")) {
      return {
        type: "application/json",
        required: true,
        description: "JSON格式的请求体",
      };
    }
    return undefined;
  }

  /**
   * 提取响应信息
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
        });
      }
    }

    // 默认响应
    if (responses.length === 0) {
      responses.push({
        status: 200,
        description: "成功响应",
      });
    }

    return responses;
  }

  /**
   * 生成API示例
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
        example.request.body = this.generateRequestBodyExample(apiPath);
      }
    }

    // 生成响应示例
    example.response = {
      status: 200,
      body: this.generateResponseExample(apiPath),
    };

    examples.push(example);

    return examples;
  }

  /**
   * 生成请求体示例
   */
  private generateRequestBodyExample(apiPath: string): any {
    if (apiPath.includes("/auth/login")) {
      return {
        username: "admin",
        password: "password123",
      };
    } else if (apiPath.includes("/auth/register")) {
      return {
        username: "newuser",
        email: "user@example.com",
        password: "password123",
        displayName: "新用户",
      };
    } else if (apiPath.includes("/posts")) {
      return {
        title: "示例文章标题",
        content: "这是文章内容...",
        excerpt: "文章摘要",
        status: "published",
        visibility: "public",
      };
    } else if (apiPath.includes("/categories")) {
      return {
        name: "示例分类",
        slug: "example-category",
        description: "分类描述",
      };
    } else if (apiPath.includes("/tags")) {
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
   * 生成响应示例
   */
  private generateResponseExample(apiPath: string): any {
    const baseResponse = {
      success: true,
      message: "操作成功",
      timestamp: new Date().toISOString(),
    };

    if (apiPath.includes("/auth/login")) {
      return {
        ...baseResponse,
        data: {
          user: {
            id: 1,
            username: "admin",
            email: "admin@example.com",
            displayName: "管理员",
            role: "admin",
            status: "active",
          },
          token: "jwt_token_here",
          refreshToken: "refresh_token_here",
        },
      };
    } else if (apiPath.includes("/posts")) {
      return {
        ...baseResponse,
        data: {
          id: 1,
          title: "示例文章",
          content: "文章内容...",
          status: "published",
          createdAt: new Date().toISOString(),
        },
      };
    }

    return baseResponse;
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
   * 获取组描述
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
      500: "服务器内部错误",
    };

    return descriptions[status] || `HTTP ${status}`;
  }
}
