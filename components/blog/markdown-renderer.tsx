"use client";

import { useMemo } from "react";
import { Card, CardBody } from "@heroui/card";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => {
  const renderedContent = useMemo(() => {
    if (!content) return "";

    return content
      // 标题
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-10 mb-6 text-foreground">$1</h1>')
      
      // 粗体和斜体
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // 行内代码
      .replace(/`(.*?)`/g, '<code class="bg-default-100 dark:bg-default-800 px-2 py-1 rounded text-sm font-mono text-danger-600 dark:text-danger-400">$1</code>')
      
      // 代码块
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-default-100 dark:bg-default-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">$2</code></pre>')
      .replace(/```\n([\s\S]*?)```/g, '<pre class="bg-default-100 dark:bg-default-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">$1</code></pre>')
      
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // 图片
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 shadow-md" loading="lazy" />')
      
      // 列表
      .replace(/^\* (.+)$/gim, '<li class="ml-6 mb-1">$1</li>')
      .replace(/^\d+\. (.+)$/gim, '<li class="ml-6 mb-1">$1</li>')
      
      // 引用
      .replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20 pl-4 py-2 my-4 italic text-default-600">$1</blockquote>')
      
      // 分割线
      .replace(/^---$/gim, '<hr class="my-8 border-0 h-px bg-gradient-to-r from-transparent via-default-300 to-transparent" />')
      
      // 段落
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
      .replace(/^(?!<[h|p|d|b|l|i|u|s|t|a|i|h|p])(.+)$/gim, '<p class="mb-4 leading-relaxed">$1</p>')
      
      // 换行
      .replace(/\n/g, '<br />');
  }, [content]);

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </div>
  );
};

export default MarkdownRenderer;
