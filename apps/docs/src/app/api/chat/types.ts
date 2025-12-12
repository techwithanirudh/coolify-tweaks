import type { UIMessage } from "ai";

export type MyUIMessage = UIMessage & {
  parts: Array<
    | UIMessage["parts"][number]
    | {
        type: "source-url";
        url: string;
        title: string;
      }
  >;
};
