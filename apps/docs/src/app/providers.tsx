"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ProgressProvider } from "@bprogress/next/app";
import { RootProvider } from "fumadocs-ui/provider/base";

import { TooltipProvider } from "@repo/ui/tooltip";

const SearchDialog = dynamic(() => import("@/components/search"), {
  ssr: false,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
    >
      <ProgressProvider
        color="var(--color-primary)"
        delay={1000}
        height="2px"
        options={{
          showSpinner: false,
        }}
        shallowRouting
        startOnLoad
        stopDelay={1000}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </ProgressProvider>
    </RootProvider>
  );
}
