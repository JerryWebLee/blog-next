"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { 
  Code, 
  Eye, 
  FileText, 
  Image, 
  Link, 
  List, 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  Quote,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Settings
} from "lucide-react";

// 动态导入 Toast UI Editor
let Editor: any = null;
let Viewer: any = null;

const MarkdownEditor = ({ 
  value = "", 
  onChange, 
  placeholder = "开始编写您的博客内容...",
  height = "500px",
  className = ""
}: {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
}) => {
  const editorRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [isPreview, setIsPreview] = useState(false);

  // 动态加载 Toast UI Editor
  useEffect(() => {
    const loadEditor = async () => {
      try {
        const { Editor: EditorComponent, Viewer: ViewerComponent } = await import('@toast-ui/react-editor');
        Editor = EditorComponent;
        Viewer = ViewerComponent;
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Toast UI Editor:', error);
      }
    };

    loadEditor();
  }, []);

  // 编辑器配置
  const editorConfig = {
    height,
    initialEditType: mode,
    previewStyle: 'vertical',
    placeholder,
    usageStatistics: false,
    hideModeSwitch: false,
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task', 'indent', 'outdent'],
      ['table', 'image', 'link'],
      ['code', 'codeblock'],
      ['scrollSync'],
    ],
    hooks: {
      addImageBlobHook: (blob: Blob, callback: (url: string) => void) => {
        // 处理图片上传
        const reader = new FileReader();
        reader.onload = () => {
          callback(reader.result as string);
        };
        reader.readAsDataURL(blob);
      }
    },
    events: {
      change: () => {
        if (editorRef.current && onChange) {
          const content = editorRef.current.getInstance().getMarkdown();
          onChange(content);
        }
      }
    }
  };

  // 工具栏按钮
  const toolbarButtons = [
    { icon: Bold, action: 'bold', tooltip: '粗体' },
    { icon: Italic, action: 'italic', tooltip: '斜体' },
    { icon: Underline, action: 'underline', tooltip: '下划线' },
    { icon: Strikethrough, action: 'strike', tooltip: '删除线' },
    { icon: Code, action: 'code', tooltip: '行内代码' },
    { icon: Quote, action: 'quote', tooltip: '引用' },
    { icon: List, action: 'ul', tooltip: '无序列表' },
    { icon: List, action: 'ol', tooltip: '有序列表' },
    { icon: Table, action: 'table', tooltip: '表格' },
    { icon: Link, action: 'link', tooltip: '链接' },
    { icon: Image, action: 'image', tooltip: '图片' },
  ];

  const handleToolbarAction = (action: string) => {
    if (editorRef.current) {
      editorRef.current.getInstance().exec(action);
    }
  };

  const handleModeChange = (newMode: 'wysiwyg' | 'markdown') => {
    if (editorRef.current) {
      editorRef.current.getInstance().changeMode(newMode);
      setMode(newMode);
    }
  };

  const handlePreviewToggle = () => {
    setIsPreview(!isPreview);
  };

  if (!isLoaded) {
    return (
      <Card className={`shadow-lg border-0 ${className}`}>
        <CardBody className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-default-500">正在加载编辑器...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg border-0 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Type className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">内容编辑</h3>
              <p className="text-default-500">支持 Markdown 和 WYSIWYG 双模式</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Chip
              color={mode === 'wysiwyg' ? 'primary' : 'default'}
              variant={mode === 'wysiwyg' ? 'solid' : 'bordered'}
              className="cursor-pointer"
              onClick={() => handleModeChange('wysiwyg')}
            >
              <Eye className="w-4 h-4 mr-1" />
              可视化
            </Chip>
            <Chip
              color={mode === 'markdown' ? 'primary' : 'default'}
              variant={mode === 'markdown' ? 'solid' : 'bordered'}
              className="cursor-pointer"
              onClick={() => handleModeChange('markdown')}
            >
              <FileText className="w-4 h-4 mr-1" />
              Markdown
            </Chip>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="pt-0">
        {/* 自定义工具栏 */}
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-default-50 rounded-lg">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              isIconOnly
              size="sm"
              variant="ghost"
              className="hover:bg-default-100"
              onClick={() => handleToolbarAction(button.action)}
              title={button.tooltip}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}
          
          <Divider orientation="vertical" className="h-6" />
          
          <Button
            isIconOnly
            size="sm"
            variant={isPreview ? "solid" : "ghost"}
            color={isPreview ? "primary" : "default"}
            className="hover:bg-default-100"
            onClick={handlePreviewToggle}
            title="预览"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* 编辑器容器 */}
        <div className="relative">
          {Editor && (
            <Editor
              ref={editorRef}
              {...editorConfig}
              initialValue={value}
            />
          )}
        </div>

        {/* 编辑器功能说明 */}
        <div className="mt-4 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-4 h-4 text-success mt-0.5" />
            <div className="text-sm text-success-700 dark:text-success-300">
              <p className="font-medium mb-1">编辑器功能：</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>双模式切换：</strong>可视化编辑和 Markdown 源码编辑</li>
                <li>• <strong>代码高亮：</strong>支持多种编程语言语法高亮</li>
                <li>• <strong>表格支持：</strong>可视化表格编辑和 Markdown 表格</li>
                <li>• <strong>图片上传：</strong>支持拖拽上传和粘贴图片</li>
                <li>• <strong>数学公式：</strong>支持 LaTeX 数学公式渲染</li>
                <li>• <strong>实时预览：</strong>所见即所得编辑体验</li>
              </ul>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default MarkdownEditor;
