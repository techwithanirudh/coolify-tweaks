import type { UIMessage } from "ai";

export interface SourceUrlPart {
  type: "source-url";
  sourceId: string;
  url: string;
  title: string;
}

export interface MyUIMessage extends UIMessage {
  parts: (UIMessage["parts"][number] | SourceUrlPart)[];
}
