import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

// eslint-disable-next-line @typescript-eslint/unbound-method
const { rewrite: rewriteLLM } = rewritePath("/docs/*path", "/llms.mdx/*path");
// eslint-disable-next-line @typescript-eslint/unbound-method
const { rewrite: rewriteMdx } = rewritePath(
  "/docs{/*path}.mdx",
  "/llms.mdx{/*path}",
);

export default function proxy(request: NextRequest) {
  const mdxResult = rewriteMdx(request.nextUrl.pathname);
  if (mdxResult) {
    return NextResponse.rewrite(new URL(mdxResult, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  return NextResponse.next();
}
