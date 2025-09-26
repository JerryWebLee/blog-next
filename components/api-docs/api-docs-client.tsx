'use client';

import { useState, useEffect } from 'react';
import { ApiGroup, ApiEndpoint } from '@/lib/utils/api-scanner';
import { ApiGroupCard } from './api-group-card';
import { ApiSearchBar } from './api-search-bar';
import { ApiFilterTabs } from './api-filter-tabs';
import { PageLoading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ApiDocsData {
  groups: ApiGroup[];
  stats: {
    totalGroups: number;
    totalEndpoints: number;
    lastScan: string;
  };
  message: string;
}

export function ApiDocsClient() {
  const [apiData, setApiData] = useState<ApiDocsData | null>(null);
  const [filteredGroups, setFilteredGroups] = useState<ApiGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  useEffect(() => {
    loadApiData();
  }, []);

  useEffect(() => {
    filterApiGroups();
  }, [apiData, searchQuery, selectedMethod]);

  const loadApiData = async (forceRefresh = false) => {
    try {
      setRefreshing(forceRefresh);
      const response = await fetch(`/api/api-docs${forceRefresh ? '?refresh=true' : ''}`);
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
      } else {
        console.error('Failed to load API data');
      }
    } catch (error) {
      console.error('Error loading API data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterApiGroups = () => {
    if (!apiData) return;
    
    let filtered = [...apiData.groups];

    // 按搜索查询过滤
    if (searchQuery) {
      filtered = filtered.map(group => ({
        ...group,
        endpoints: group.endpoints.filter(endpoint =>
          endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(group => group.endpoints.length > 0);
    }

    // 按HTTP方法过滤
    if (selectedMethod !== 'all') {
      filtered = filtered.map(group => ({
        ...group,
        endpoints: group.endpoints.filter(endpoint => endpoint.method === selectedMethod)
      })).filter(group => group.endpoints.length > 0);
    }

    setFilteredGroups(filtered);
  };

  const handleRefresh = () => {
    loadApiData(true);
  };

  if (loading) {
    return <PageLoading text="加载API文档中..." />;
  }

  return (
    <div className="space-y-6">
      {/* 统计信息和刷新按钮 */}
      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">API接口统计</h2>
            {apiData?.stats && (
              <p className="text-sm text-muted-foreground mt-1">
                共 {apiData.stats.totalGroups} 个API组，{apiData.stats.totalEndpoints} 个接口
                {apiData.stats.lastScan !== '未扫描' && (
                  <span className="ml-2">最后扫描：{apiData.stats.lastScan}</span>
                )}
              </p>
            )}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '刷新中...' : '刷新'}
          </Button>
        </div>

        {/* 搜索和过滤栏 */}
        <ApiSearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="mt-4">
          <ApiFilterTabs
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
          />
        </div>
      </div>

      {/* API组列表 */}
      <div className="space-y-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery || selectedMethod !== 'all' 
                ? '没有找到匹配的API接口' 
                : '暂无API接口数据'
              }
            </p>
            {!searchQuery && selectedMethod === 'all' && (
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                className="mt-4"
                disabled={refreshing}
              >
                重新扫描
              </Button>
            )}
          </div>
        ) : (
          filteredGroups.map((group) => (
            <ApiGroupCard key={group.name} group={group} />
          ))
        )}
      </div>
    </div>
  );
}
