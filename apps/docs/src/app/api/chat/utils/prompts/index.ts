import { corePrompt } from "./core";
import { directivesPrompt } from "./directives";
import { examplesPrompt } from "./examples";
import { toolsPrompt } from "./tools";

export const systemPrompt = () =>
  [corePrompt, directivesPrompt, toolsPrompt, examplesPrompt]
    .filter(Boolean)
    .join("\n\n")
    .trim();
