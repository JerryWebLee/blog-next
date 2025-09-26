"use client";

import { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiExample } from "@/lib/utils/api-scanner";

interface ApiExamplesProps {
  examples: ApiExample[];
}

export function ApiExamples({ examples }: ApiExamplesProps) {
  const [activeExample, setActiveExample] = useState(0);

  if (examples.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">暂无示例</div>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateCurlCommand = (example: ApiExample) => {
    let curl = `curl -X ${example.name.includes("GET") ? "GET" : "POST"} "${window.location.origin}/api/example"`;

    if (example.request?.headers) {
      Object.entries(example.request.headers).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
    }

    if (example.request?.body) {
      curl += ` \\\n  -d '${JSON.stringify(example.request.body, null, 2)}'`;
    }

    return curl;
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-foreground">使用示例</h4>

      {/* 示例选择器 */}
      {examples.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {examples.map((example, index) => (
            <Button
              key={index}
              variant={activeExample === index ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveExample(index)}
            >
              {example.name}
            </Button>
          ))}
        </div>
      )}

      {/* 当前示例内容 */}
      {examples[activeExample] && (
        <div className="space-y-4">
          {examples[activeExample].description && (
            <p className="text-sm text-muted-foreground">{examples[activeExample].description}</p>
          )}

          {/* 请求示例 */}
          {examples[activeExample].request && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-sm">请求示例</h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generateCurlCommand(examples[activeExample]))}
                  className="h-8 w-8 p-0"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                </Button>
              </div>

              {examples[activeExample].request?.headers && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Headers:</span>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(examples[activeExample].request?.headers, null, 2)}
                  </pre>
                </div>
              )}

              {examples[activeExample].request?.body && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Body:</span>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(examples[activeExample].request?.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* 响应示例 */}
          {examples[activeExample].response && (
            <div className="space-y-2">
              <h5 className="font-medium text-sm">响应示例</h5>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{examples[activeExample].response?.status}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(examples[activeExample].response?.body, null, 2))}
                  className="h-8 w-8 p-0"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                </Button>
              </div>
              <pre className="p-3 bg-muted rounded-md text-xs overflow-x-auto">
                {JSON.stringify(examples[activeExample].response?.body, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
