import type { UIMessage } from "ai";
import {
  convertToModelMessages,
  InvalidToolInputError,
  NoSuchToolError,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";

import { env } from "@/env";
import { systemPrompt } from "@/lib/ai/prompts";
import { provider } from "@/lib/ai/providers";
import { getPageContent } from "@/lib/ai/tools/get-page-content";
import { provideLinks } from "@/lib/ai/tools/provide-links";
import { searchDocs } from "@/lib/ai/tools/search-docs";
import { categories } from "@/lib/constants";
import { source } from "@/lib/source";

function getLLMsTxt() {
  const scanned: string[] = [];
  scanned.push("# Docs");
  const map = new Map<string, string[]>();

  for (const page of source.getPages()) {
    const dir = page.slugs[0];
    if (!dir) continue;
    const list = map.get(dir) ?? [];
    list.push(`- [${page.data.title}](${page.url}): ${page.data.description}`);
    map.set(dir, list);
  }

  for (const [key, value] of map) {
    scanned.push(`## ${categories[key] ?? key}`);
    scanned.push(value.join("\n"));
  }

  return scanned.join("\n\n");
}

export async function POST(request: Request) {
  const body = (await request.json()) as { messages: UIMessage[] };
  const { messages } = body;

  const result = streamText({
    model: provider.languageModel("chat-model"),
    system: systemPrompt({ llms: getLLMsTxt() }),
    tools: {
      provideLinks,
      searchDocs,
      getPageContent,
    },
    messages: convertToModelMessages(messages, {
      ignoreIncompleteToolCalls: true,
    }),
    toolChoice: "auto",
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: "line",
    }),
    stopWhen: stepCountIs(15),
    onStepFinish: ({ toolResults }) => {
      if (env.NODE_ENV !== "production") {
        console.log(`Step Results: ${JSON.stringify(toolResults, null, 2)}`);
      }
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (env.NODE_ENV !== "production") {
        console.error("An error occurred:", {
          name: (error as Error).name,
          message: (error as Error).message,
        });
      }

      if (NoSuchToolError.isInstance(error)) {
        return "The model tried to call an unknown tool.";
      } else if (InvalidToolInputError.isInstance(error)) {
        return "The model called a tool with invalid arguments.";
      } else {
        return "An unknown error occurred.";
      }
    },
  });
}
