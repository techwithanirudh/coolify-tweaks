import type React from "react";
import { cn } from "@repo/ui";
import { Puzzle, ServerCog } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import type { badgeVariants } from "@repo/ui/badge";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";

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

const InstallMethods: React.FC<InstallMethodsProps> = ({
  className = ""
}) => {
  return (
    <div
      className={cn("flex flex-col gap-1 lg:gap-2 w-full relative", className)}
    >
      {INSTALL_METHODS.map(({ slug, title, subtitle, Icon, tags }) => (
        <Card key={slug} className="flex-1 transform hover:scale-[1.02] transition-transform duration-200 py-2 px-2 lg:py-3 lg:px-3 gap-1 bg-background">
          <Link href={`/docs/style/installation/${slug}`} className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col gap-1.5 lg:gap-2">
              <div className="flex items-center gap-1.5 lg:gap-2">
                <div className="size-6 bg-primary rounded-md flex items-center justify-center shrink-0">
                  <Icon className="text-primary-foreground size-3" />
                </div>
                <h4 className="text-foreground font-semibold text-xs lg:text-sm">
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
                  className="text-[10px] lg:text-xs px-1 lg:px-1.5 py-0.5 "
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default InstallMethods;
