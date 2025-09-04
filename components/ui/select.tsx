"use client";

import * as React from "react";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const SelectItem = ({ children, value, ...props }: any) => {
  // 确保value是有效的字符串
  if (!value || typeof value !== "string") {
    console.warn("SelectItem: value prop must be a non-empty string");
    return null;
  }

  return (
    <ListboxItem key={value} {...props}>
      {children}
    </ListboxItem>
  );
};

// 为了保持API兼容性，创建包装组件
export const SelectGroup = ({ children, ...props }: React.PropsWithChildren<any>) => <div {...props}>{children}</div>;

export const SelectValue = ({
  placeholder,
  ...props
}: { placeholder?: string } & React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{placeholder}</span>;

export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
SelectContent.displayName = "SelectContent";

export const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
  )
);
SelectLabel.displayName = "SelectLabel";

export const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
);
SelectSeparator.displayName = "SelectSeparator";

export const SelectScrollUpButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props} />
  )
);
SelectScrollUpButton.displayName = "SelectScrollUpButton";

export const SelectScrollDownButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props} />
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";
