import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type React from "react";
import Link from "next/link";
import { Puzzle, ServerCog } from "lucide-react";

import type { badgeVariants } from "@repo/ui/badge";
import { cn } from "@repo/ui";
import { Badge } from "@repo/ui/badge";

interface InstallMethodsProps {
  className?: string;
}

interface InstallMethodConfig {
  slug: string;
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  tags: {
    label: string;
    variant: VariantProps<typeof badgeVariants>["variant"];
  }[];
}

const INSTALL_METHODS: InstallMethodConfig[] = [
  {
    slug: "stylus",
    title: "Stylus",
    subtitle: "Browser Extension",
    Icon: Puzzle,
    tags: [
      { label: "Chrome", variant: "outline" },
      { label: "Firefox", variant: "outline" },
      { label: "Edge", variant: "outline" },
      { label: "One-click install", variant: "default" },
    ],
  },
  {
    slug: "dynamic-config",
    title: "Dynamic Config",
    subtitle: "Works everywhere, traefik rewrite",
    Icon: ServerCog,
    tags: [
      { label: "🌐 All browsers & devices", variant: "outline" },
      { label: "👥 Perfect for teams", variant: "outline" },
    ],
  },
];

const InstallMethods: React.FC<InstallMethodsProps> = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col gap-1 overflow-y-auto p-1 sm:p-3 lg:gap-2",
        className,
      )}
    >
      {INSTALL_METHODS.map(({ slug, title, subtitle, Icon, tags }) => (
        <Link
          href={`/docs/style/installation/${slug}`}
          className="bg-background flex h-full w-full flex-1 flex-col justify-between rounded-xl border px-2 py-2 shadow-sm transition-transform duration-200 hover:scale-[1.02] lg:px-3 lg:py-3"
          key={slug}
        >
          <div className="flex flex-col gap-1.5 lg:gap-2">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <div className="bg-primary flex size-6 shrink-0 items-center justify-center rounded-md">
                <Icon className="text-primary-foreground size-3" />
              </div>
              <h4 className="text-foreground text-xs font-semibold lg:text-sm">
                {title}
              </h4>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 lg:gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag.label}
                variant={tag.variant}
                className="px-1 py-0.5 text-[10px] lg:px-1.5 lg:text-xs"
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default InstallMethods;
