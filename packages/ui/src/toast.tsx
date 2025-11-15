"use client";

import type { ToasterProps } from "sonner";
import { Toaster as Sonner, toast } from "sonner";

import { useTheme } from "next-themes";

export const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as "light" | "dark" | "system" | undefined}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { toast };
