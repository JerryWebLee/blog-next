"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Clipboard, Code } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiEndpoint } from "@/lib/utils/api-scanner";
import { ApiExamples } from "./api-examples";
import { ApiParameters } from "./api-parameters";
import { ApiRequestBody } from "./api-request-body";
import { ApiResponses } from "./api-responses";

interface ApiEndpointCardProps {
  endpoint: ApiEndpoint;
}

export function ApiEndpointCard({ endpoint }: ApiEndpointCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"parameters" | "request" | "responses" | "examples">("parameters");

  const getMethodColor = (method: string) => {
    const colors = {
      GET: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      POST: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      PATCH: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateCurlCommand = () => {
    let curl = `curl -X ${endpoint.method} "${window.location.origin}${endpoint.path}"`;

    if (endpoint.requestBody) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(endpoint.requestBody, null, 2)}'`;
    }

    return curl;
  };

  return (
    <Card className="border-l-4 border-l-primary/20">
      <CardContent className="p-4">
        <div
          className="cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{endpoint.path}</code>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(generateCurlCommand());
                }}
                className="h-8 w-8 p-0"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="h-8 w-8 p-0"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {endpoint.description && <p className="text-sm text-muted-foreground mt-2 ml-7">{endpoint.description}</p>}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* 标签页导航 */}
            <div className="flex space-x-1 border-b">
              {[
                { key: "parameters", label: "参数", count: endpoint.parameters?.length || 0 },
                { key: "request", label: "请求体", count: endpoint.requestBody ? 1 : 0 },
                { key: "responses", label: "响应", count: endpoint.responses?.length || 0 },
                { key: "examples", label: "示例", count: endpoint.examples?.length || 0 },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                  {count > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* 标签页内容 */}
            <div className="min-h-[200px]">
              {activeTab === "parameters" && <ApiParameters parameters={endpoint.parameters || []} />}
              {activeTab === "request" && <ApiRequestBody requestBody={endpoint.requestBody} />}
              {activeTab === "responses" && <ApiResponses responses={endpoint.responses || []} />}
              {activeTab === "examples" && <ApiExamples examples={endpoint.examples || []} />}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
