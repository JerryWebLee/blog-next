"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 执行搜索逻辑
      console.log("搜索:", searchQuery);
      // 这里可以添加实际的搜索功能
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setIsExpanded(true)} className="h-9 w-9 p-0">
        <Search className="h-4 w-4" />
        <span className="sr-only">搜索</span>
      </Button>
    );
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜索文章..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 pl-10 pr-10"
          autoFocus
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" size="sm">
        搜索
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="h-9 w-9 p-0">
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
}
