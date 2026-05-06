import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { HTTPError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { $fetch } from "ofetch";

import { owner, repo } from "@/config";

const GITHUB_FETCH_ATTEMPTS = 3;
const GITHUB_RETRY_DELAY_MS = 250;
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

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

  const response = await fetchGitHubAsset(url);

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

async function fetchGitHubAsset(url: string) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= GITHUB_FETCH_ATTEMPTS; attempt++) {
    try {
      const response = await $fetch.raw(url, {
        method: "GET",
        responseType: "text",
        ignoreResponseError: true,
        retry: 0,
        headers: { Accept: "*/*" },
      });

      if (
        response.ok ||
        !RETRYABLE_STATUS_CODES.has(response.status) ||
        attempt === GITHUB_FETCH_ATTEMPTS
      ) {
        return response;
      }
    } catch (error) {
      lastError = error;
      if (attempt === GITHUB_FETCH_ATTEMPTS) break;
    }

    await wait(GITHUB_RETRY_DELAY_MS * attempt);
  }

  throw new HTTPError({
    status: 502,
    statusMessage: "Bad Gateway",
    message:
      lastError instanceof Error
        ? `GitHub request failed: ${lastError.message}`
        : "GitHub request failed.",
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFromLocal(asset: string): Promise<FetchResult> {
  const { stylePath } = useRuntimeConfig();
  const basePath = resolve(stylePath);
  if (isAbsolute(asset)) {
    throw new HTTPError({
      status: 400,
      statusMessage: "Bad Request",
      message: "Absolute asset paths are not allowed.",
    });
  }

  const resolvedPath = resolve(basePath, asset);
  if (!resolvedPath.startsWith(`${basePath}/`)) {
    throw new HTTPError({
      status: 400,
      statusMessage: "Bad Request",
      message: "Invalid asset path.",
    });
  }

  try {
    const content = await readFile(resolvedPath, "utf-8");
    return { content };
  } catch {
    throw new HTTPError({
      status: 404,
      statusMessage: "Not Found",
      message: `Local asset not found: ${asset}. Run 'pnpm dev:style' first.`,
    });
  }
}
