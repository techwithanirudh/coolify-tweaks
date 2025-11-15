import { Wrench, Sparkles, Hammer, Star, Github } from "lucide-react";
import { humanizeNumber } from "@/lib/github";
import { CommitCard } from "./commit-card";
import { cn } from "@repo/ui";
import type { LucideIcon } from "lucide-react";

interface CommitConfig {
    comment: string;
    Icon: LucideIcon;
    className?: string;
}

const COMMITS: CommitConfig[] = [
    {
        comment: "fix(styles): improve spacing",
        Icon: Wrench,
        className: "top-1/2 left-1/2 -translate-x-[calc(50%+1rem)] -translate-y-18",
    },
    {
        comment: "feat(themes): add custom themes",
        Icon: Sparkles,
        className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
        comment: "docs(install): update Stylus guide",
        Icon: Hammer,
        className: "top-1/2 left-1/2 -translate-x-[calc(50%-1rem)] translate-y-7",
    },
];

interface GitHubShowcaseProps {
    owner: string;
    repo: string;
    stars: number;
}

export function GitHubShowcase({ owner, repo, stars }: GitHubShowcaseProps) {
    return (
        <div className="flex flex-col size-full relative group">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border z-10 shrink-0">
                <a className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary/80 hover:text-primary" href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer">
                    <Github className="size-3" />
                    <span className="font-medium truncate">{owner}/{repo}</span>
                </a>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Star className="size-3" />
                    <span>{humanizeNumber(stars)}</span>
                </div>
            </div>
            <div className="flex-1 relative overflow-hidden">
                <div className="size-full flex flex-col items-center justify-center gap-2 lg:hidden px-4">
                    {COMMITS.slice(0, 2).map(({ comment, Icon, className }, index) => (
                        <CommitCard
                            key={`mobile-${index}`}
                            comment={comment}
                            icon={<Icon className="size-3 sm:size-4 text-muted-foreground" />}
                            className={cn(className, "relative inset-0 translate-x-0 translate-y-0 group-hover:translate-x-0 w-full")}
                        />
                    ))}
                </div>
                <div className="size-full hidden lg:block">
                    {COMMITS.map(({ comment, Icon, className }, index) => (
                        <CommitCard
                            key={`desktop-${index}`}
                            comment={comment}
                            icon={<Icon className="size-3 sm:size-4 text-muted-foreground" />}
                            className={className}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
