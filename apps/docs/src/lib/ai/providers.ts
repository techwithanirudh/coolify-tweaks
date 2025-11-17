import { openai } from "@ai-sdk/openai";
import { customProvider } from "ai";

export const provider = customProvider({
  languageModels: {
    "chat-model": openai("gpt-5-mini"),
    "artifact-model": openai("gpt-5-nano"),
  },
  textEmbeddingModels: {
    "small-model": openai.embedding("text-embedding-3-small"),
    "large-model": openai.embedding("text-embedding-3-large"),
  },
});
