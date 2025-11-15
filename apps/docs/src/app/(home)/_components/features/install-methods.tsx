import type React from "react";
import { cn } from "@repo/ui";
import { Puzzle, ServerCog } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import type { badgeVariants } from "@repo/ui/badge";
import type { VariantProps } from "class-variance-authority";

interface InstallMethodsProps {
  className?: string;
}

interface InstallMethodConfig {
  key: string;
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
    key: "browser-extension",
    title: "Browser Extension",
    subtitle: "Quick setup",
    Icon: Puzzle,
    tags: [
      { label: "Chrome", variant: "outline" },
      { label: "Firefox", variant: "outline" },
      { label: "Edge", variant: "outline" },
      { label: "One-click install", variant: "default" },
    ],
  },
  {
    key: "server-injection",
    title: "Server Injection",
    subtitle: "Works everywhere",
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
      className={cn("flex flex-col gap-1 sm:gap-2 size-full relative", className)}
    >
      {INSTALL_METHODS.map(({ key, title, subtitle, Icon, tags }) => (
        <Card key={key} className="flex-1 transform hover:scale-[1.02] transition-transform duration-200 py-2 px-2 sm:py-3 sm:px-3 gap-1 bg-background justify-between">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="size-5 sm:size-6 bg-primary rounded-md flex items-center justify-center shrink-0">
                <Icon className="text-primary-foreground h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
              </div>
              <h4 className="text-foreground font-semibold text-xs sm:text-sm">
                {title}
              </h4>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag.label}
                variant={tag.variant}
                className="text-[10px] md:text-xs px-1 sm:px-1.5 py-0.5 "
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InstallMethods;
