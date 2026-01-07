import { getRSS } from "@/lib/rss";

export const revalidate = false;

export async function GET() {
  const rss = await getRSS();
  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
