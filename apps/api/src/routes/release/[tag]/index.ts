import { lookup as getType } from "mime-types";
import { $fetch } from "nitro/deps/ofetch";
import { getQuery, getRouterParam, H3Event, HTTPError } from "nitro/h3";
import { defineRouteMeta } from "nitro/runtime";

import { allowedHeaders, owner, repo } from "@/config";
import { processContent } from "@/utils/stylus";

defineRouteMeta({
  openAPI: {
    tags: ["Releases"],
    summary: "Get release asset",
    description:
      "Fetch a release asset from GitHub releases with optional theme injection. Defaults to `main.user.css` if no asset is specified. When a theme is provided, CSS variables from TweakCN are injected into the userstyle.",
    operationId: "getReleaseAsset",
    parameters: [
      {
        in: "path",
        name: "tag",
        required: true,
        description:
          "Release tag identifier. Use `latest` for the most recent release, or a specific version tag like `v3.8.10`.",
        schema: {
          type: "string",
        },
        example: "latest",
      },
      {
        in: "query",
        name: "asset",
        required: false,
        description:
          "Name of the asset file to retrieve from the release. Defaults to `main.user.css` if not specified.",
        schema: {
          type: "string",
          default: "main.user.css",
        },
        example: "main.user.css",
      },
      {
        in: "query",
        name: "theme",
        required: false,
        description:
          "TweakCN theme identifier for CSS variable injection. Only applies when requesting `main.user.css`. Browse available themes at https://tweakcn.com/themes.",
        schema: {
          type: "string",
          pattern: "^c[a-z0-9]{24}$",
        } as { type: "string"; pattern: string },
        example: "c1234567890abcdefghijklmn",
      },
    ],
    responses: {
      "200": {
        description: "Successfully retrieved release asset.",
        content: {
          "text/css": {
            schema: {
              type: "string",
              description:
                "CSS content with optional theme variables injected.",
            },
            examples: {
              default_css: {
                summary: "Default CSS response",
                value:
                  '/* ==UserStyle==\n@name coolify-tweaks\n@version 3.9.6\n@namespace https://github.com/techwithanirudh\n@author Anirudh Sriram <hello@techwithanirudh.com> (https://github.com/techwithanirudh)\n@homepageURL https://coolify-tweaks.techwithanirudh.com\n@updateURL https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css\n@description Opinionated tweaks for Coolify: better spacing, layout, and color polish.\n@license MIT\n==/UserStyle== */\n@-moz-document url-prefix("https://app.coolify.io/"), url-prefix("http://app.coolify.io/"), url-prefix("https://coolify.local:8000/"), url-prefix("http://coolify.local:8000/"){@import "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap";\n\n/* ==UI-THEME-VARS:START== */\n\n:root {\n  --background: #fdfdfd;\n  --foreground: #000;\n  --card: #fdfdfd;\n  --card-foreground: #000;\n  --popover: #f4f5f7;\n  --popover-foreground: #000;\n  --primary: #7033ff;\n  --primary-foreground: #fff;\n  --secondary: #edf0f4;\n  --secondary-foreground: #080808;\n  --muted: #f5f5f5;\n  --muted-foreground: #525252;\n  --accent: #eceef2;\n  --accent-foreground: #000;\n  --destructive: #e40014;\n  --destructive-foreground: #fff;\n  --border: #e7e7ee;\n  --input: #ebebeb;\n  --ring: #000;\n  --sidebar: #f4f5f7;\n  --sidebar-foreground: #000;\n  --sidebar-primary: #000;\n  --sidebar-primary-foreground: #fff;\n  --sidebar-accent: #ebebeb;\n  --sidebar-accent-foreground: #000;\n  --sidebar-border: #ebebeb;\n  --sidebar-ring: #000;\n  --shadow-2xs: 0px 2px 3px 0px #00000014;\n  --shadow-xs: 0px 2px 3px 0px #00000014;\n  --shadow-sm: 0px 2px 3px 0px #00000029, 0px 1px 2px -1px #00000029;\n  --shadow: 0px 2px 3px 0px #00000029, 0px 1px 2px -1px #00000029;\n  --shadow-md: 0px 2px 3px 0px #00000029, 0px 2px 4px -1px #00000029;\n  --shadow-lg: 0px 2px 3px 0px #00000029, 0px 4px 6px -1px #00000029;\n  --shadow-xl: 0px 2px 3px 0px #00000029, 0px 8px 10px -1px #00000029;\n  --shadow-2xl: 0px 2px 3px 0px #0006;\n  --tracking-normal: -.025em;\n  --spacing: .27rem;\n  --radius: .875rem;\n}\n\n@supports (color: lab(0% 0 0)) {\n  :root {\n    --background: lab(99.304% 0 -.0000119209);\n    --foreground: lab(0% 0 0);\n    --card: lab(99.304% 0 -.0000119209);\n    --card-foreground: lab(0% 0 0);\n    --popover: lab(96.508% -.0796914 -1.09795);\n    --popover-foreground: lab(0% 0 0);\n    --primary: lab(41.276% 61.6029 -92.3266);\n    --primary-foreground: lab(100% 0 0);\n    --secondary: lab(94.6509% -.49904 -2.31887);\n    --secondary-foreground: lab(2.19295% -.00000745058 0);\n    --muted: lab(96.5432% -.0000298023 0);\n    --muted-foreground: lab(34.8776% -.0000149012 0);\n    --accent: lab(94.025% -.154316 -2.1927);\n    --accent-foreground: lab(0% 0 0);\n    --destructive: lab(48.4493% 77.4328 61.5452);\n    --destructive-foreground: lab(100% 0 0);\n    --border: lab(91.7977% .94524 -3.41178);\n    --input: lab(93.0516% -.0000298023 0);\n    --ring: lab(0% 0 0);\n    --sidebar: lab(96.508% -.0796914 -1.09795);\n    --sidebar-foreground: lab(0% 0 0);\n    --sidebar-primary: lab(0% 0 0);\n    --sidebar-primary-foreground: lab(100% 0 0);\n    --sidebar-accent: lab(93.0516% -.0000298023 0);\n    --sidebar-accent-foreground: lab(0% 0 0);\n    --sidebar-border: lab(93.0516% -.0000298023 0);\n    --sidebar-ring: lab(0% 0 0);\n  }\n}\n\n.dark {\n  --background: #1f1c23;\n  --foreground: #fdfdfc;\n  --card: #353239;\n  --card-foreground: #fcfafc;\n  --popover: #1a191f;\n  --popover-foreground: #f0f0f0;\n  --primary: #483492;\n  --primary-foreground: #fff;\n  --secondary: #2a2c33;\n  --secondary-foreground: #f0f0f0;\n  --muted: #2a2c33;\n  --muted-foreground: #a0a0a0;\n  --accent: #2a292e;\n  --accent-foreground: #ceced0;\n  --destructive: #ff6568;\n  --destructive-foreground: #fff;\n  --border: #38353b;\n  --input: #38353b;\n  --ring: #8c5cff;\n  --sidebar: #1a191f;\n  --sidebar-foreground: #fbfafc;\n  --sidebar-primary: #2a292e;\n  --sidebar-primary-foreground: #fff;\n  --sidebar-accent: #2a292e;\n  --sidebar-accent-foreground: #fbf9fb;\n  --sidebar-border: #33353a;\n  --sidebar-ring: #8c5cff;\n  --shadow-2xs: 0px 2px 3px 0px #00000014;\n  --shadow-xs: 0px 2px 3px 0px #00000014;\n  --shadow-sm: 0px 2px 3px 0px #00000029, 0px 1px 2px -1px #00000029;\n  --shadow: 0px 2px 3px 0px #00000029, 0px 1px 2px -1px #00000029;\n  --shadow-md: 0px 2px 3px 0px #00000029, 0px 2px 4px -1px #00000029;\n  --shadow-lg: 0px 2px 3px 0px #00000029, 0px 4px 6px -1px #00000029;\n  --shadow-xl: 0px 2px 3px 0px #00000029, 0px 8px 10px -1px #00000029;\n  --shadow-2xl: 0px 2px 3px 0px #0006;\n}\n\n@supports (color: lab(0% 0 0)) {\n  .dark {\n    --background: lab(10.8451% 2.84829 -4.27331);\n    --foreground: lab(99.292% -.128835 .473607);\n    --card: lab(21.3129% 2.60812 -3.94655);\n    --card-foreground: lab(98.4697% .956982 -.721276);\n    --popover: lab(9.07116% 1.71524 -4.00495);\n    --popover-foreground: lab(94.7916% -.0000298023 0);\n    --primary: lab(28.5039% 28.6027 -49.9206);\n    --primary-foreground: lab(100% 0 0);\n    --secondary: lab(18.0168% .439614 -4.84897);\n    --secondary-foreground: lab(94.7916% -.0000298023 0);\n    --muted: lab(18.0168% .439614 -4.84897);\n    --muted-foreground: lab(65.8728% .0000298023 -.0000119209);\n    --accent: lab(16.8478% 1.38634 -3.08989);\n    --accent-foreground: lab(82.8086% .269026 -.982189);\n    --destructive: lab(63.7053% 60.745 31.3109);\n    --destructive-foreground: lab(100% 0 0);\n    --border: lab(22.6425% 2.38898 -3.2687);\n    --input: lab(22.6425% 2.38898 -3.2687);\n    --ring: lab(51.3492% 47.9995 -75.7176);\n    --sidebar: lab(9.07116% 1.71524 -4.00495);\n    --sidebar-foreground: lab(98.3888% .598282 -.828302);\n    --sidebar-primary: lab(16.8478% 1.38634 -3.08989);\n    --sidebar-primary-foreground: lab(100% 0 0);\n    --sidebar-accent: lab(16.8478% 1.38634 -3.08989);\n    --sidebar-accent-foreground: lab(98.1217% .957042 -.721276);\n    --sidebar-border: lab(22.1025% .0234395 -3.45786);\n    --sidebar-ring: lab(51.3492% 47.9995 -75.7176);\n  }\n}\n\n/* ==UI-THEME-VARS:END== */',
              },
              themed_css: {
                summary: "CSS with theme injection",
                value:
                  '/* ==UserStyle==\n@name coolify-tweaks\n@version 3.9.6\n@namespace https://github.com/techwithanirudh\n@author Anirudh Sriram <hello@techwithanirudh.com> (https://github.com/techwithanirudh)\n@homepageURL https://coolify-tweaks.techwithanirudh.com\n@updateURL https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css&theme=c1234567890abcdefghijklmn\n@description Opinionated tweaks for Coolify: better spacing, layout, and color polish.\n@license MIT\n==/UserStyle== */\n@-moz-document url-prefix("https://app.coolify.io/"), url-prefix("http://app.coolify.io/"), url-prefix("https://coolify.local:8000/"), url-prefix("http://coolify.local:8000/"){@import "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap";\n\n/* ==UI-THEME-VARS:START== */\n\n.theme {\n  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;\n  --radius: .85rem;\n  --tracking-tighter: calc(var(--tracking-normal) - .05em);\n  --tracking-tight: calc(var(--tracking-normal) - .025em);\n  --tracking-wide: calc(var(--tracking-normal) + .025em);\n  --tracking-wider: calc(var(--tracking-normal) + .05em);\n  --tracking-widest: calc(var(--tracking-normal) + .1em);\n}\n\n:root {\n  --background: lab(99.304% 0 -.0000119209);\n  --foreground: lab(0% 0 0);\n  --card: lab(99.304% 0 -.0000119209);\n  --card-foreground: lab(0% 0 0);\n  --popover: lab(96.508% -.0796914 -1.09795);\n  --popover-foreground: lab(0% 0 0);\n  --primary: lab(41.276% 61.6029 -92.3266);\n  --primary-foreground: lab(100% 0 0);\n  --secondary: lab(94.6509% -.49904 -2.31887);\n  --secondary-foreground: lab(2.19295% -.00000745058 0);\n  --muted: lab(96.5432% -.0000298023 0);\n  --muted-foreground: lab(34.8776% -.0000149012 0);\n  --accent: lab(94.025% -.154316 -2.1927);\n  --accent-foreground: lab(0% 0 0);\n  --destructive: lab(48.4493% 77.4328 61.5452);\n  --destructive-foreground: lab(100% 0 0);\n  --border: lab(91.7977% .94524 -3.41178);\n  --input: lab(93.0516% -.0000298023 0);\n  --ring: lab(0% 0 0);\n  --sidebar: lab(96.508% -.0796914 -1.09795);\n  --sidebar-foreground: lab(0% 0 0);\n  --sidebar-primary: lab(0% 0 0);\n  --sidebar-primary-foreground: lab(100% 0 0);\n  --sidebar-accent: lab(93.0516% -.0000298023 0);\n  --sidebar-accent-foreground: lab(0% 0 0);\n  --sidebar-border: lab(93.0516% -.0000298023 0);\n  --sidebar-ring: lab(0% 0 0);\n}\n\n.dark {\n  --background: lab(10.8451% 2.84829 -4.27331);\n  --foreground: lab(99.292% -.128835 .473607);\n  --card: lab(21.3129% 2.60812 -3.94655);\n  --card-foreground: lab(98.4697% .956982 -.721276);\n  --popover: lab(9.07116% 1.71524 -4.00495);\n  --popover-foreground: lab(94.7916% -.0000298023 0);\n  --primary: lab(28.5039% 28.6027 -49.9206);\n  --primary-foreground: lab(100% 0 0);\n  --secondary: lab(18.0168% .439614 -4.84897);\n  --secondary-foreground: lab(94.7916% -.0000298023 0);\n  --muted: lab(18.0168% .439614 -4.84897);\n  --muted-foreground: lab(65.8728% .0000298023 -.0000119209);\n  --accent: lab(16.8478% 1.38634 -3.08989);\n  --accent-foreground: lab(82.8086% .269026 -.982189);\n  --destructive: lab(63.7053% 60.745 31.3109);\n  --destructive-foreground: lab(100% 0 0);\n  --border: lab(22.6425% 2.38898 -3.2687);\n  --input: lab(22.6425% 2.38898 -3.2687);\n  --ring: lab(51.3492% 47.9995 -75.7176);\n  --sidebar: lab(9.07116% 1.71524 -4.00495);\n  --sidebar-foreground: lab(98.3888% .598282 -.828302);\n  --sidebar-primary: lab(16.8478% 1.38634 -3.08989);\n  --sidebar-primary-foreground: lab(100% 0 0);\n  --sidebar-accent: lab(16.8478% 1.38634 -3.08989);\n  --sidebar-accent-foreground: lab(98.1217% .957042 -.721276);\n  --sidebar-border: lab(22.1025% .0234395 -3.45786);\n  --sidebar-ring: lab(51.3492% 47.9995 -75.7176);\n}\n\n/* ==UI-THEME-VARS:END== */',
              },
            },
          },
          "application/octet-stream": {
            schema: {
              type: "string",
              format: "binary",
            },
          },
        },
        headers: {
          "X-Proxy-Host": {
            schema: {
              type: "string",
            },
            example: "github.com",
          },
          ETag: {
            schema: {
              type: "string",
            },
            description: "Entity tag from GitHub response (if available)",
          },
          "Last-Modified": {
            schema: {
              type: "string",
            },
            description:
              "Last modified date from GitHub response (if available)",
          },
        },
      },
      "400": {
        description: "Bad request. Invalid parameters provided.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "boolean",
                  example: true,
                },
                url: {
                  type: "string",
                  format: "uri",
                  example: "http://localhost:3001/release/latest",
                },
                status: {
                  type: "integer",
                  example: 400,
                },
                statusText: {
                  type: "string",
                  example: "Bad Request",
                },
                message: {
                  type: "string",
                  example: "Invalid input",
                },
                data: {
                  type: "object",
                  additionalProperties: true,
                  example: {
                    field: "tag",
                  },
                },
              },
              required: ["error", "url", "status", "message"],
            },
            example: {
              error: true,
              url: "http://localhost:3001/release/latest",
              status: 400,
              statusText: "Bad Request",
              message: "Invalid input",
              data: {
                field: "tag",
              },
            },
          },
        },
      },
      "404": {
        description:
          "Resource not found. The release tag, asset, or theme does not exist.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "boolean",
                  example: true,
                },
                url: {
                  type: "string",
                  format: "uri",
                  example:
                    "http://localhost:3001/release/latest?theme=invalid123",
                },
                status: {
                  type: "integer",
                  example: 404,
                },
                statusText: {
                  type: "string",
                  example: "Not Found",
                },
                message: {
                  type: "string",
                  example: "Theme not found: invalid123",
                },
                data: {
                  type: "object",
                  additionalProperties: true,
                  example: {
                    url: "https://github.com/techwithanirudh/coolify-tweaks/releases/latest/download/main.user.css",
                    tag: "latest",
                  },
                },
              },
              required: ["error", "url", "status", "message"],
            },
            examples: {
              theme_not_found: {
                summary: "Theme not found",
                value: {
                  error: true,
                  url: "http://localhost:3001/release/latest?theme=invalid123",
                  status: 404,
                  statusText: "Not Found",
                  message: "Theme not found: invalid123",
                },
              },
              github_not_found: {
                summary: "Release tag or asset not found on GitHub",
                value: {
                  error: true,
                  url: "http://localhost:3001/release/nonexistent-tag",
                  status: 404,
                  statusText: "Not Found",
                  message: "GitHub returned 404: Not Found",
                  data: {
                    url: "https://github.com/techwithanirudh/coolify-tweaks/releases/download/nonexistent-tag/main.user.css",
                    tag: "nonexistent-tag",
                  },
                },
              },
            },
          },
        },
      },
      "500": {
        description:
          "Internal server error. An unexpected error occurred while processing the request.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "boolean",
                  example: true,
                },
                url: {
                  type: "string",
                  format: "uri",
                  example: "http://localhost:3001/release/latest",
                },
                status: {
                  type: "integer",
                  example: 500,
                },
                statusText: {
                  type: "string",
                  example: "Internal Server Error",
                },
                message: {
                  type: "string",
                  example: "Unknown error",
                },
                data: {
                  type: "object",
                  additionalProperties: true,
                  example: {
                    url: "https://github.com/techwithanirudh/coolify-tweaks/releases/latest/download/main.user.css",
                    tag: "latest",
                  },
                },
              },
              required: ["error", "url", "status", "message"],
            },
            example: {
              error: true,
              url: "http://localhost:3001/release/latest",
              status: 500,
              statusText: "Internal Server Error",
              message: "Unknown error",
              data: {
                url: "https://github.com/techwithanirudh/coolify-tweaks/releases/latest/download/main.user.css",
                tag: "latest",
              },
            },
          },
        },
      },
    },
  },
});

export default async (event: H3Event) => {
  const tag = getRouterParam(event, "tag");
  const assetParam = getQuery(event).asset;
  const asset =
    typeof assetParam === "string" && assetParam.length > 0
      ? assetParam
      : "main.user.css";

  if (!(tag && asset)) {
    throw new HTTPError({
      status: 400,
      statusMessage: "Bad Request",
      message: "Invalid input",
      data: { field: tag ? "asset" : "tag" },
    });
  }

  const url =
    tag === "latest"
      ? `https://github.com/${owner}/${repo}/releases/latest/download/${encodeURIComponent(asset)}`
      : `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset)}`;

  try {
    const {
      _data: content,
      headers: rawHeaders,
      status,
      statusText,
      ok,
    } = await $fetch.raw(url, {
      method: "GET",
      responseType: "text",
      ignoreResponseError: true,
      retry: 0,
      headers: { Accept: "*/*" },
    });

    if (!ok) {
      throw new HTTPError({
        status,
        statusMessage: statusText,
        message: `GitHub returned ${status}: ${statusText}`,
        data: { url, tag },
      });
    }

    const contentText = typeof content === "string" ? content : "";
    const processed = await processContent({ content: contentText, event });

    const detected = getType(asset);

    event.res.headers.set(
      "Content-Type",
      detected || "application/octet-stream",
    );
    event.res.headers.set("X-Proxy-Host", "github.com");

    const headers = new Headers(rawHeaders);

    for (const headerName of allowedHeaders) {
      const value = headers.get(headerName);
      if (value) {
        event.res.headers.set(headerName, value);
      }
    }

    return processed;
  } catch (error) {
    if (error instanceof HTTPError) {
      throw error;
    }

    throw new HTTPError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: `${error instanceof Error ? error.message : "Unknown error"}`,
      data: { url, tag },
    });
  }
};
