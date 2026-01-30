export interface Tag {
  name: string;
  description?: string;
  value: string | undefined;
}

export const tags: Tag[] = [
  {
    name: "All",
    value: undefined,
  },
  {
    name: "Style",
    description: "Only results about the style",
    value: "style",
  },
  {
    name: "API",
    description: "Only results about the API",
    value: "api",
  },
  {
    name: "Development",
    description: "Only results about development",
    value: "development",
  },
];
