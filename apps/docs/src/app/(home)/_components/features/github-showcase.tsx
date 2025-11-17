import type { LucideIcon } from "lucide-react";
import type React from "react";
import { Github, Hammer, Sparkles, Star, Wrench } from "lucide-react";

import { cn } from "@repo/ui";
import { Shimmer } from "@repo/ui/shimmer";

import { humanizeNumber } from "@/lib/github";

const COMMITS: CommitCardProps[] = [
  {
    comment: "fix(styles): improve spacing",
    Icon: Wrench,
  },
  {
    comment: "feat(themes): add custom themes",
    Icon: Sparkles,
  },
  {
    comment: "docs(install): update Stylus guide",
    Icon: Hammer,
  },
];

export interface CommitCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  comment: string;
  Icon: LucideIcon;
}

export function CommitCard({
  className,
  comment,
  Icon,
  ...props
}: CommitCardProps) {
  return (
    <div
      className={cn(
        "bg-background border-border absolute inline-flex h-10 w-80 transform items-center gap-2 rounded-full border px-3 shadow-xs transition-all select-none lg:w-72",
        className,
      )}
      {...props}
    >
      <span className="shrink-0">
        <Icon className="text-muted-foreground group-hover:text-primary size-3 transition-colors duration-200 lg:size-4" />
      </span>
      <Shimmer as="p" className="font-mono text-xs">
        {comment}
      </Shimmer>
    </div>
  );
}

export function GitHubShowcase({
  owner,
  repo,
  stars,
}: {
  owner: string;
  repo: string;
  stars: number;
}) {
  return (
    <div className="group relative flex size-full flex-col">
      <div className="border-border z-10 flex shrink-0 items-center justify-between border-b px-3 py-2 lg:px-4 lg:py-3">
        <a
          className="text-primary/80 hover:text-primary flex items-center gap-1.5 text-xs lg:gap-2 lg:text-sm"
          href={`https://github.com/${owner}/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="size-3" />
          <span className="truncate font-medium">
            {owner}/{repo}
          </span>
        </a>
        <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
          <a
            className="group/stars flex items-center gap-1 text-xs transition-colors duration-200 hover:text-yellow-500 lg:text-sm dark:hover:text-yellow-700"
            href={`https://github.com/${owner}/${repo}/stargazers`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Star className="size-3" />
            <span>{humanizeNumber(stars)}</span>
          </a>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="flex size-full flex-col items-center justify-center gap-2 px-4 lg:hidden">
          {COMMITS.slice(0, 2).map(({ comment, Icon, className }, index) => (
            <CommitCard
              key={`mobile-${index}`}
              comment={comment}
              Icon={Icon}
              className={cn("relative w-full", className)}
            />
          ))}
        </div>

        <div className="relative hidden size-full lg:block">
          {COMMITS.map(({ comment, Icon, className }, index) => {
            const middle = (COMMITS.length - 1) / 2;
            const offset = index - middle;
            const zIndex = COMMITS.length - index;

            return (
              <CommitCard
                key={`desktop-${index}`}
                comment={comment}
                Icon={Icon}
                className={cn(
                  "max-w-full transition-transform duration-200",
                  "absolute top-1/2 left-1/2 group-hover:translate-x-[-50%]",
                  `translate-x-[calc(-50%+var(--offset)*(--spacing(4)))]`,
                  `translate-y-[calc(-50%+var(--offset)*(--spacing(10.5)))]`,
                  className,
                )}
                style={
                  { zIndex: zIndex, "--offset": offset } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
