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
    name: "Home",
    description: "Only results about the main documentation page",
    value: "(index)",
  },
  {
    name: "API Reference",
    description: "Only results about the API reference",
    value: "api-reference",
  },
  {
    name: "Changelog",
    description: "Only results about the changelog",
    value: "changelog",
  },
];
