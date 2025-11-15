"use client";

import { cn } from "@repo/ui";
import { Shimmer } from "@repo/ui/shimmer";

export interface CommitCardProps {
    className?: string;
    comment: string;
    icon: React.ReactNode;
}

export function CommitCard({ className, comment, icon }: CommitCardProps) {
    return (
        <div
            className={cn(
                "bg-background border-border absolute inline-flex h-10 w-80 transform select-none items-center rounded-full border px-3 transition-all lg:w-72 gap-2 shadow-xs group-hover:-translate-x-1/2",
                className,
            )}
        >
            <span className="shrink-0">
                {icon}
            </span>
            <Shimmer as="p" className="font-mono text-xs">
                {comment}
            </Shimmer>
        </div>
    );
}
