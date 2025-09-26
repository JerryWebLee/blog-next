"use client";

import { useEffect, useState } from "react";

import { PageLoading } from "@/components/ui/loading";
import { ApiEndpoint, ApiGroup } from "@/lib/utils/api-scanner";
import { ApiFilterTabs } from "./api-filter-tabs";
import { ApiGroupCard } from "./api-group-card";
import { ApiSearchBar } from "./api-search-bar";

export function ApiDocsClient() {
  const [apiGroups, setApiGroups] = useState<ApiGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<ApiGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");

  useEffect(() => {
    loadApiData();
  }, []);

  useEffect(() => {
    filterApiGroups();
  }, [apiGroups, searchQuery, selectedMethod]);

  const loadApiData = async () => {
    try {
      const response = await fetch("/api/api-docs");
      if (response.ok) {
        const data = await response.json();
        setApiGroups(data);
      } else {
        console.error("Failed to load API data");
      }
    } catch (error) {
      console.error("Error loading API data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterApiGroups = () => {
    let filtered = [...apiGroups];

    // 按搜索查询过滤
    if (searchQuery) {
      filtered = filtered
        .map((group) => ({
          ...group,
          endpoints: group.endpoints.filter(
            (endpoint) =>
              endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
              endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              endpoint.method.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.endpoints.length > 0);
    }

    // 按HTTP方法过滤
    if (selectedMethod !== "all") {
      filtered = filtered
        .map((group) => ({
          ...group,
          endpoints: group.endpoints.filter((endpoint) => endpoint.method === selectedMethod),
        }))
        .filter((group) => group.endpoints.length > 0);
    }

    setFilteredGroups(filtered);
  };

  if (loading) {
    return <PageLoading text="加载API文档中..." />;
  }

  return (
    <div className="space-y-6">
      {/* 搜索和过滤栏 */}
      <div className="bg-card p-6 rounded-lg border">
        <ApiSearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="mt-4">
          <ApiFilterTabs selectedMethod={selectedMethod} onMethodChange={setSelectedMethod} />
        </div>
      </div>

      {/* API组列表 */}
      <div className="space-y-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery || selectedMethod !== "all" ? "没有找到匹配的API接口" : "暂无API接口数据"}
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => <ApiGroupCard key={group.name} group={group} />)
        )}
      </div>
    </div>
  );
}
