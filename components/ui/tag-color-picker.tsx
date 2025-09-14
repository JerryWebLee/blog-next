/**
 * 标签颜色选择器组件
 * 提供预设颜色和自定义颜色选择功能
 */

"use client";

import { useState } from "react";
import { Button, Card, CardBody, Input, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Check, Palette } from "lucide-react";

// 预设颜色选项
const PRESET_COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#6b7280", // gray-500
  "#1f2937", // gray-800
  "#f7df1e", // JavaScript yellow
  "#3178c6", // TypeScript blue
  "#61dafb", // React cyan
  "#4fc08d", // Vue green
  "#339933", // Node.js green
  "#3776ab", // Python blue
  "#1572b6", // CSS blue
  "#e34f26", // HTML orange
  "#2496ed", // Docker blue
  "#f05032", // Git red
];

interface TagColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

/**
 * 标签颜色选择器组件
 * @param value 当前选中的颜色值
 * @param onChange 颜色变化回调函数
 * @param disabled 是否禁用
 */
export function TagColorPicker({ value, onChange, disabled = false }: TagColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || "#6b7280");

  // 处理预设颜色选择
  const handlePresetColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  // 处理自定义颜色选择
  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  // 处理自定义颜色确认
  const handleCustomColorConfirm = () => {
    onChange(customColor);
    setIsOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-start">
      <PopoverTrigger>
        <Button
          isDisabled={disabled}
          variant="bordered"
          startContent={<Palette className="w-4 h-4" />}
          className="min-w-0"
        >
          <div className="w-4 h-4 rounded border border-default-300" style={{ backgroundColor: value || "#6b7280" }} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4">
        <Card>
          <CardBody className="p-0">
            {/* 预设颜色网格 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-foreground mb-3">预设颜色</h4>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handlePresetColorSelect(color)}
                    className={`
                      w-8 h-8 rounded border-2 transition-all duration-200 hover:scale-110
                      ${value === color ? "border-primary shadow-lg" : "border-default-300 hover:border-primary"}
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {value === color && <Check className="w-4 h-4 text-white mx-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 分割线 */}
            <div className="border-t border-default-200 mb-4" />

            {/* 自定义颜色输入 */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">自定义颜色</h4>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-16 h-10 p-0 border-0"
                  classNames={{
                    input: "p-0 h-full",
                    inputWrapper: "p-0 min-h-0 h-10",
                  }}
                />
                <Input
                  placeholder="#000000"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1"
                  startContent="#"
                />
                <Button size="sm" color="primary" onPress={handleCustomColorConfirm} isDisabled={!customColor}>
                  确定
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
