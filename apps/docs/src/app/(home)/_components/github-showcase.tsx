import type { ReactNode } from "react";
import { Wrench, Sparkles, Hammer, Star, Github } from "lucide-react";
import { cn } from "@repo/ui";
import { Shimmer } from "@repo/ui/shimmer";
import { humanizeNumber } from "@/lib/github";

function CommitCard({
    className,
    comment,
    icon,
}: {
    className?: string;
    comment: string;
    icon: ReactNode;
}) {
    return (
        <div
            className={cn(
                "bg-background border-border absolute inline-flex h-10 w-80 transform select-none items-center rounded-full border px-3 transition-all lg:w-72 gap-2 shadow-xs group-hover:-translate-x-1/2",
                className,
            )}
        >
            <span className="shrink-0">{icon}</span>
            <Shimmer color="var(--muted-foreground)" className="font-mono text-xs" text={comment} />
        </div>
    );
}

const COMMITS = [
    {
        comment: "fix(styles): improve spacing",
        icon: <Wrench className="w-4 h-4 text-muted-foreground" />,
        className: "top-1/2 left-1/2 -translate-x-[calc(50%+1rem)] -translate-y-18",
    },
    {
        comment: "feat(themes): add custom themes",
        icon: <Sparkles className="w-4 h-4 text-muted-foreground" />,
        className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
        comment: "docs(install): update Stylus guide",
        icon: <Hammer className="w-4 h-4 text-muted-foreground" />,
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
            <div className="flex items-center justify-between px-4 py-3 border-b border-border z-10 shrink-0">
                <a className="flex items-center gap-2 text-sm text-primary/80 hover:text-primary" href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer">
                    <Github className="size-3" />
                    <span className="font-medium">{owner}/{repo}</span>
                </a>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3" />
                    <span>{humanizeNumber(stars)}</span>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
                {COMMITS.map((commit, index) => (
                    <CommitCard
                        key={index}
                        comment={commit.comment}
                        icon={commit.icon}
                        className={commit.className}
                    />
                ))}
            </div>
        </div>
    );
}
