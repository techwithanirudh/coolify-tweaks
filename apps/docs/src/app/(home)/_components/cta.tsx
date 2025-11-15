import { Button } from "@repo/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2">
      <div className="self-stretch px-6 md:px-24 py-12 md:py-12 flex justify-center items-center gap-6 relative z-10 bg-dashed">
        <div className="w-full px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center flex justify-center flex-col text-3xl font-semibold leading-tight tracking-tight">
              Ready to polish your Coolify dashboard?
            </div>
            <div className="self-stretch text-center text-muted-foreground text-base font-medium leading-7">
              Install Coolify Tweaks in minutes and transform your dashboard
              <br />
              with better spacing, typography, and colors.
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-12">
            <div className="flex justify-start items-center gap-4">
              <Button
                variant="default"
                size="lg"
                className="rounded-full"
                asChild
              >
                <Link href="/docs/style">
                  Read The Docs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

