import { baseUrl } from "./metadata";

export function url(path: string): string {
  return new URL(path, baseUrl).toString();
}
