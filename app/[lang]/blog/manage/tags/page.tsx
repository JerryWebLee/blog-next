/**
 * 标签管理页面
 * 提供标签的增删改查功能
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Edit, MoreVertical, Plus, Search, Tag as TagIcon, Trash2 } from "lucide-react";

import { ApiResponse, PaginatedResponseData, Tag, TagQueryParams } from "@/types/blog";

/**
 * 标签管理页面组件
 */
export default function TagsManagePage() {
  const router = useRouter();

  // 状态管理
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // 模态框状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 获取标签列表
  const fetchTags = async (params: Partial<TagQueryParams> = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: params.page?.toString() || currentPage.toString(),
        limit: limit.toString(),
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
        ...(params.search && { search: params.search }),
        ...(params.isActive !== undefined && { isActive: params.isActive.toString() }),
      });

      const response = await fetch(`/api/tags?${queryParams}`);
      const result: ApiResponse<PaginatedResponseData<Tag>> = await response.json();

      if (result.success && result.data) {
        setTags(result.data.data);
        setTotalPages(result.data.pagination.totalPages);
        setTotal(result.data.pagination.total);
      } else {
        console.error("获取标签列表失败:", result.message);
      }
    } catch (error) {
      console.error("获取标签列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchTags({ search: query, page: 1 });
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTags({ page, search: searchQuery });
  };

  // 删除标签
  const handleDeleteTag = async () => {
    if (!selectedTag) return;

    try {
      setDeleteLoading(true);

      const response = await fetch(`/api/tags/${selectedTag.id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        setIsDeleteModalOpen(false);
        setSelectedTag(null);
        fetchTags();
      } else {
        alert(result.message || "删除标签失败");
      }
    } catch (error) {
      console.error("删除标签失败:", error);
      alert("删除标签失败");
    } finally {
      setDeleteLoading(false);
    }
  };

  // 打开删除模态框
  const openDeleteModal = (tag: Tag) => {
    setSelectedTag(tag);
    setIsDeleteModalOpen(true);
  };

  // 切换标签状态
  const toggleTagStatus = async (tag: Tag) => {
    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !tag.isActive }),
      });

      const result: ApiResponse<Tag> = await response.json();

      if (result.success) {
        fetchTags();
      } else {
        alert(result.message || "更新标签状态失败");
      }
    } catch (error) {
      console.error("更新标签状态失败:", error);
      alert("更新标签状态失败");
    }
  };

  // 初始化
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">标签管理</h1>
          <p className="text-default-600 mt-2">管理博客标签，包括创建、编辑、删除和状态控制</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => router.push("/blog/manage/tags/create")}
        >
          创建标签
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardBody>
          <div className="flex gap-4">
            <Input
              placeholder="搜索标签名称..."
              value={searchQuery}
              onValueChange={handleSearch}
              startContent={<Search className="w-4 h-4 text-default-400" />}
              className="max-w-md"
            />
          </div>
        </CardBody>
      </Card>

      {/* 标签列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TagIcon className="w-5 h-5" />
            <span className="text-lg font-semibold">标签列表</span>
            <Chip size="sm" variant="flat">
              共 {total} 个标签
            </Chip>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table aria-label="标签列表">
                <TableHeader>
                  <TableColumn>标签</TableColumn>
                  <TableColumn>描述</TableColumn>
                  <TableColumn>文章数量</TableColumn>
                  <TableColumn>状态</TableColumn>
                  <TableColumn>创建时间</TableColumn>
                  <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: tag.color || "#667eea" }}
                          />
                          <div>
                            <div className="font-medium">{tag.name}</div>
                            <div className="text-sm text-default-500">{tag.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{tag.description || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat">
                          {tag.postCount || 0}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Switch
                          isSelected={tag.isActive}
                          onValueChange={() => toggleTagStatus(tag)}
                          color="success"
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>{new Date(tag.createdAt).toLocaleDateString("zh-CN")}</TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly variant="light" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="edit"
                              startContent={<Edit className="w-4 h-4" />}
                              onPress={() => router.push(`/blog/manage/tags/edit/${tag.id}`)}
                            >
                              编辑
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              startContent={<Trash2 className="w-4 h-4" />}
                              onPress={() => openDeleteModal(tag)}
                            >
                              删除
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination total={totalPages} page={currentPage} onChange={handlePageChange} showControls />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* 删除确认模态框 */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} size="sm">
        <ModalContent>
          <ModalHeader>确认删除</ModalHeader>
          <ModalBody>
            <p>
              确定要删除标签 <strong>{selectedTag?.name}</strong> 吗？
            </p>
            <p className="text-sm text-danger mt-2">注意：如果该标签下还有文章，将无法删除。</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsDeleteModalOpen(false)}>
              取消
            </Button>
            <Button color="danger" onPress={handleDeleteTag} isLoading={deleteLoading}>
              删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
