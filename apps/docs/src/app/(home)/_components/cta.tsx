import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@repo/ui/button";

export function CTA() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden">
      <div className="bg-dashed relative z-10 flex items-center justify-center gap-6 self-stretch px-6 py-12 md:px-24 md:py-12">
        <div className="relative z-20 flex w-full flex-col items-center justify-start gap-6 overflow-hidden rounded-lg px-6 py-5 md:py-8">
          <div className="flex flex-col items-start justify-start gap-3 self-stretch">
            <div className="flex flex-col justify-center self-stretch text-center text-3xl leading-tight font-semibold tracking-tight">
              Ready to polish your Coolify dashboard?
            </div>
            <div className="text-muted-foreground self-stretch text-center text-base leading-7 font-medium">
              Install Coolify Tweaks in minutes and transform your dashboard
              <br />
              with better spacing, typography, and colors.
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-12">
            <div className="flex items-center justify-start gap-4">
              <Button
                variant="default"
                size="lg"
                className="group/button rounded-full"
                asChild
              >
                <Link href="/docs/style">
                  Read The Docs
                  <ArrowUpRight className="size-4 transition-transform group-hover/button:-rotate-12" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
