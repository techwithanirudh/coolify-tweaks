"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { cva } from "class-variance-authority";
import {
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen,
} from "lucide-react";

import { cn } from "@/lib/fumadocs/cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

const itemVariants = cva(
  "hover:bg-fd-accent hover:text-fd-accent-foreground flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-sm [&_svg]:size-4",
);

export function Files({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn("not-prose bg-fd-card rounded-md border p-2", className)}
      {...props}
    >
      {props.children}
    </div>
  );
}

export interface FileProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: ReactNode;
  description?: string;
}

export interface FolderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: string;

  disabled?: boolean;

  /**
   * Open folder by default
   *
   * @defaultValue false
   */
  defaultOpen?: boolean;
}

export function File({
  name,
  icon = <FileIcon />,
  description,
  className,
  ...rest
}: FileProps): React.ReactElement {
  return (
    <div className={cn(itemVariants({ className }))} {...rest}>
      {icon}
      <div className="flex flex-row flex-wrap items-center text-left">
        <span>{name}</span>
        {description ? (
          <span className="text-fd-muted-foreground text-xs">
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function Folder({
  name,
  description,
  defaultOpen = false,
  ...props
}: FolderProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <CollapsibleTrigger
        className={cn(
          itemVariants({
            className: "w-full [&_svg]:shrink-0 [&_svg]:self-start",
          }),
        )}
      >
        {open ? <FolderOpen /> : <FolderIcon />}
        <div className="flex flex-row flex-wrap items-center gap-1 text-left">
          <span>{name}</span>
          {description ? (
            <span className="text-fd-muted-foreground text-xs">
              {description}
            </span>
          ) : null}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-2 flex flex-col border-l ps-2">{props.children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
