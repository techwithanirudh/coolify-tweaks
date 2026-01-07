import { z } from "zod";

const KnownAnswerConfidence = z.enum([
  "very_confident",
  "somewhat_confident",
  "not_confident",
  "no_sources",
  "other",
]);

const AnswerConfidence = z.union([KnownAnswerConfidence, z.string()]); // evolvable

const AIAnnotationsToolSchema = z.looseObject({
  answerConfidence: AnswerConfidence,
});

export const ProvideAIAnnotationsToolSchema = z.object({
  aiAnnotations: AIAnnotationsToolSchema,
});
