"use client";

import { isToolUIPart } from "ai";
import {
  Brain,
  ChevronDownIcon,
  LinkIcon,
  SearchIcon,
  WrenchIcon,
} from "lucide-react";
import { Loader2 } from "lucide-react";

import type { MyUIMessage } from "@/app/api/chat/types";
import { Shimmer } from "@/components/fumadocs/ai/shimmer";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/fumadocs/ai/sources";

type MessageMetadataProps = {
  parts: MyUIMessage["parts"];
  inProgress: boolean;
};

export const MessageMetadata = ({
  parts,
  inProgress,
}: MessageMetadataProps) => {
  // Pull out last part that is either text or tool call
  const lastPart = parts
    .filter((part) => part.type === "text" || isToolUIPart(part))
    .at(-1);

  const reasoning = parts.at(-1)?.type === "reasoning";

  if (!lastPart) {
    return (
      <div className="flex items-center gap-2">
        {reasoning ? (
          <>
            <Brain className="size-4" />
            <Shimmer>Thinking...</Shimmer>
          </>
        ) : (
          <Loader2 className="size-4 animate-spin" />
        )}
      </div>
    );
  }

  const tool = isToolUIPart(lastPart) ? lastPart : null;

  const sources = Array.from(
    new Map(
      parts
        .filter((part) => part.type === "source-url")
        .map((part) => [part.url, part]),
    ).values(),
  );

  if (sources.length > 0 && !(tool && inProgress)) {
    return (
      <Sources className="group/source peer/source">
        <SourcesTrigger count={sources.length}>
          <span className="relative size-4">
            <SearchIcon className="absolute inset-0 size-4 transition-opacity duration-200 group-hover/source:opacity-0" />
            <ChevronDownIcon className="absolute inset-0 size-4 opacity-0 transition-all duration-200 group-hover/source:opacity-100 peer-data-[state=open]/source:rotate-180" />
          </span>
          <p>Used {sources.length} sources</p>
        </SourcesTrigger>
        <SourcesContent>
          <ul className="flex flex-col gap-2">
            {sources.map((source) => (
              <li className="ml-4.5 list-disc pl-1" key={source.url}>
                <Source href={source.url} title={source.url}>
                  {source.title ?? source.url}
                </Source>
              </li>
            ))}
          </ul>
        </SourcesContent>
      </Sources>
    );
  }

  if (tool && inProgress) {
    let Icon = WrenchIcon;
    let label = "Working";
    const name = tool.type
      .replace("tool-", "")
      .replace(/([A-Z])/g, " $1")
      .trim();

    switch (tool.type) {
      case "tool-searchDocs":
        Icon = SearchIcon;
        label = "Searching docs";
        break;
      case "tool-getPageContent":
        Icon = LinkIcon;
        label = "Fetching page";
        break;
      default:
        label = `Running ${name}`;
        break;
    }

    return (
      <div className="flex animate-pulse items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <Shimmer>{label}</Shimmer>
      </div>
    );
  }

  if (!tool && sources.length === 0) {
    return null;
  }

  return <div className="h-12" />;
};
