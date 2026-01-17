import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { $fetch } from "nitro/deps/ofetch";
import { HTTPError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

import { owner, repo } from "@/config";

export interface FetchResult {
  content: string;
  headers?: Headers;
}

export async function fetchAsset(
  tag: string,
  asset: string,
): Promise<FetchResult> {
  if (import.meta.dev) {
    return fetchFromLocal(asset);
  }
  return fetchFromGitHub(tag, asset);
}

async function fetchFromGitHub(
  tag: string,
  asset: string,
): Promise<FetchResult> {
  const url =
    tag === "latest"
      ? `https://github.com/${owner}/${repo}/releases/latest/download/${encodeURIComponent(asset)}`
      : `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset)}`;

  const response = await $fetch.raw(url, {
    method: "GET",
    responseType: "text",
    ignoreResponseError: true,
    retry: 0,
    headers: { Accept: "*/*" },
  });

  if (!response.ok) {
    throw new HTTPError({
      status: response.status,
      statusMessage: response.statusText,
      message: `GitHub returned ${response.status}: ${response.statusText}`,
    });
  }

  return {
    content: typeof response._data === "string" ? response._data : "",
    headers: new Headers(response.headers),
  };
}

async function fetchFromLocal(asset: string): Promise<FetchResult> {
  const { stylePath } = useRuntimeConfig();

  try {
    const content = await readFile(resolve(stylePath, asset), "utf-8");
    return { content };
  } catch {
    throw new HTTPError({
      status: 404,
      statusMessage: "Not Found",
      message: `Local asset not found: ${asset}. Run 'pnpm dev:style' first.`,
    });
  }
}
