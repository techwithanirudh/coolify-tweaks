import type { ComponentProps } from "react";
import Link from "fumadocs-core/link";

import { cn } from "@repo/ui";
import { Skeleton } from "@repo/ui/skeleton";

interface GetPageContentInput {
  path: string;
}

export interface GetPageContentOutput {
  success: boolean;
  data?: string;
}

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

export function GetPageContentVisualizer({
  state,
  input,
  output,
  ...props
}: {
  state?: ToolState;
  input?: Partial<GetPageContentInput>;
  output?: GetPageContentOutput;
} & ComponentProps<"div">) {
  const isSkeleton = state === "input-streaming" || state === "input-available";

  if (isSkeleton) {
    return (
      <div
        {...props}
        className={cn("bg-fd-card rounded-xl p-3", props.className)}
      >
        <div className="space-y-2">
          <div className="bg-fd-muted/50 rounded-lg border p-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!input) return null;
  if (!input.path) return null;

  const pagePath = input.path.startsWith("/")
    ? input.path
    : `/docs/${input.path}`;

  return (
    <div
      {...props}
      className={cn("bg-fd-card rounded-xl p-3", props.className)}
    >
      <div className="mb-3 space-y-1">
        <div className="text-fd-muted-foreground text-xs">
          <span className="font-medium">Path:</span>{" "}
          <Link href={pagePath} className="text-fd-primary hover:underline">
            {input.path}
          </Link>
        </div>
      </div>
      {output?.success && output.data && (
        <div className="space-y-2">
          <div className="bg-fd-muted/50 max-h-32 overflow-y-auto rounded-lg border p-2">
            <pre className="text-fd-muted-foreground line-clamp-6 text-xs whitespace-pre-wrap">
              {output.data}
            </pre>
          </div>
        </div>
      )}
      {output?.success === false && (
        <div className="text-fd-destructive text-xs">
          {output.data || "Page not found"}
        </div>
      )}
    </div>
  );
}
