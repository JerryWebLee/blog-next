/**
 * 标签管理主页面
 * 提供标签的增删改查功能
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
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
import {
  BarChart3,
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Hash,
  MoreVertical,
  Palette,
  Plus,
  Search,
  Tag as TagIcon,
  Trash2,
} from "lucide-react";

import { message } from "@/lib/utils";
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
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

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

  // 状态筛选处理
  const handleStatusFilter = (status: boolean | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchTags({ isActive: status, page: 1, search: searchQuery });
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTags({ page, search: searchQuery, isActive: statusFilter });
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
        message.error(result.message || "删除标签失败");
      }
    } catch (error) {
      console.error("删除标签失败:", error);
      message.error("删除标签失败");
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
        message.error(result.message || "更新标签状态失败");
      }
    } catch (error) {
      console.error("更新标签状态失败:", error);
      message.error("更新标签状态失败");
    }
  };

  // 初始化
  useEffect(() => {
    fetchTags();
  }, []);

  // 统计信息
  const activeTags = tags.filter((tag) => tag.isActive).length;
  const inactiveTags = tags.filter((tag) => !tag.isActive).length;

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            标签管理
          </h1>
          <p className="text-default-600 mt-2 text-lg">管理博客标签，包括创建、编辑、删除和状态控制</p>
        </div>

        {/* 统计卡片 */}
        <div className="flex gap-4">
          <Card className="p-4 min-w-[120px]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{total}</p>
                <p className="text-sm text-default-500">总标签</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 min-w-[120px]">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{activeTags}</p>
                <p className="text-sm text-default-500">激活</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 min-w-[120px]">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{inactiveTags}</p>
                <p className="text-sm text-default-500">停用</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 操作栏 */}
      <Card>
        <CardBody>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <Input
              placeholder="搜索标签名称..."
              value={searchQuery}
              onValueChange={handleSearch}
              startContent={<Search className="w-4 h-4 text-default-400" />}
              className="flex-1 max-w-md"
            />

            {/* 状态筛选 */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === undefined ? "solid" : "bordered"}
                color={statusFilter === undefined ? "primary" : "default"}
                onPress={() => handleStatusFilter(undefined)}
                startContent={<Filter className="w-4 h-4" />}
              >
                全部
              </Button>
              <Button
                variant={statusFilter === true ? "solid" : "bordered"}
                color={statusFilter === true ? "success" : "default"}
                onPress={() => handleStatusFilter(true)}
                startContent={<Eye className="w-4 h-4" />}
              >
                激活
              </Button>
              <Button
                variant={statusFilter === false ? "solid" : "bordered"}
                color={statusFilter === false ? "warning" : "default"}
                onPress={() => handleStatusFilter(false)}
                startContent={<EyeOff className="w-4 h-4" />}
              >
                停用
              </Button>
            </div>

            {/* 创建按钮 */}
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={() => router.push("/tags/manage/create")}
              className="lg:ml-auto"
            >
              创建标签
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 标签列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TagIcon className="w-5 h-5" />
            <span className="text-lg font-semibold">标签列表</span>
            <Badge content={total} color="primary" variant="flat">
              <Chip size="sm" variant="flat">
                共 {total} 个标签
              </Chip>
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-12">
              <TagIcon className="w-16 h-16 text-default-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-default-600 mb-2">暂无标签</h3>
              <p className="text-default-500 mb-4">开始创建你的第一个标签吧</p>
              <Button
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onPress={() => router.push("/tags/manage/create")}
              >
                创建标签
              </Button>
            </div>
          ) : (
            <>
              <Table aria-label="标签列表" className="min-h-[400px]">
                <TableHeader>
                  <TableColumn>标签信息</TableColumn>
                  <TableColumn>描述</TableColumn>
                  <TableColumn>文章数量</TableColumn>
                  <TableColumn>状态</TableColumn>
                  <TableColumn>创建时间</TableColumn>
                  <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id} className="hover:bg-default-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                            style={{ backgroundColor: tag.color || "#667eea" }}
                          >
                            <Hash className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{tag.name}</div>
                            <div className="text-sm text-default-500 flex items-center gap-1">
                              <span>#{tag.slug}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {tag.description ? (
                            <p className="truncate text-default-700">{tag.description}</p>
                          ) : (
                            <span className="text-default-400 italic">无描述</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={tag.postCount && tag.postCount > 0 ? "primary" : "default"}
                        >
                          {tag.postCount || 0} 篇
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            isSelected={tag.isActive}
                            onValueChange={() => toggleTagStatus(tag)}
                            color="success"
                            size="sm"
                          />
                          <span className="text-sm text-default-600">{tag.isActive ? "激活" : "停用"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-default-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(tag.createdAt).toLocaleDateString("zh-CN")}
                        </div>
                      </TableCell>
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
                              onPress={() => router.push(`/tags/manage/edit/${tag.id}`)}
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
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    showControls
                    showShadow
                    color="primary"
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* 删除确认模态框 */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} size="sm">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-danger" />
              确认删除
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <p>
                确定要删除标签 <strong className="text-foreground">{selectedTag?.name}</strong> 吗？
              </p>
              <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-700 flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  注意：如果该标签下还有文章，将无法删除。
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsDeleteModalOpen(false)}>
              取消
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteTag}
              isLoading={deleteLoading}
              startContent={!deleteLoading && <Trash2 className="w-4 h-4" />}
            >
              {deleteLoading ? "删除中..." : "删除"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
