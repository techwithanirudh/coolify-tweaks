import type React from "react";
import { Wrench, Sparkles, Hammer, Star, Github } from "lucide-react";
import { humanizeNumber } from "@/lib/github";
import { cn } from "@repo/ui";
import type { LucideIcon } from "lucide-react";
import { Shimmer } from "@repo/ui/shimmer";

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

export function CommitCard({ className, comment, Icon, ...props }: CommitCardProps) {
    return (
        <div
            className={cn(
                "bg-background border-border absolute inline-flex h-10 w-80 transform select-none items-center rounded-full border px-3 transition-all lg:w-72 gap-2 shadow-xs",
                className,
            )}
            {...props}
        >
            <span className="shrink-0">
                <Icon className="size-3 sm:size-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </span>
            <Shimmer as="p" className="font-mono text-xs">
                {comment}
            </Shimmer>
        </div>
    );
}

export function GitHubShowcase({ owner, repo, stars }: {
    owner: string;
    repo: string;
    stars: number;
}) {
    return (
        <div className="flex flex-col size-full relative group">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border z-10 shrink-0">
                <a
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary/80 hover:text-primary"
                    href={`https://github.com/${owner}/${repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github className="size-3" />
                    <span className="font-medium truncate">
                        {owner}/{repo}
                    </span>
                </a>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <a
                        className="flex items-center gap-1 text-xs sm:text-sm hover:text-yellow-500 dark:hover:text-yellow-700 transition-colors duration-200 group/stars"
                        href={`https://github.com/${owner}/${repo}/stargazers`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Star className="size-3" />
                        <span>{humanizeNumber(stars)}</span>
                    </a>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <div className="size-full flex flex-col items-center justify-center gap-2 lg:hidden px-4">
                    {COMMITS.slice(0, 2).map(({ comment, Icon, className }, index) => (
                        <CommitCard
                            key={`mobile-${index}`}
                            comment={comment}
                            Icon={Icon}
                            className={cn("w-full relative", className)}
                        />
                    ))}
                </div>

                <div className="size-full hidden lg:block relative">
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
                                    `translate-x-[calc(-50%+var(--offset)*(--spacing(6)))]`,
                                    `translate-y-[calc(-50%+var(--offset)*(--spacing(12)))]`,
                                    className
                                )}
                                style={{ zIndex: zIndex, "--offset": offset } as React.CSSProperties}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
