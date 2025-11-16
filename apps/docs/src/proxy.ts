import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { rewrite: rewriteLLM } = rewritePath("/docs/*path", "/llms.mdx/*path");

const REMOVE_HEADERS: string[] = [
  "x-vercel-cache",
  "x-vercel-id",
  "server",
];

function removeHeaders(response: NextResponse): NextResponse {
  for (const header of REMOVE_HEADERS) {
    response.headers.delete(header);
  }
  return response;
}

export default function proxy(request: NextRequest) {
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname);

    if (result) {
      const response = NextResponse.rewrite(new URL(result, request.nextUrl));
      return removeHeaders(response);
    }
  }

  const response = NextResponse.next();
  return removeHeaders(response);
}
