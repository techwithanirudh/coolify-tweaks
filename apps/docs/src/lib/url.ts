import { baseUrl } from "./metadata";

export const url = (path: string): string => new URL(path, baseUrl).toString();
