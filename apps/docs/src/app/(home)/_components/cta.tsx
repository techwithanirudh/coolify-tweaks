"use client";

import Link from "next/link";

export function CTA() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2">
      {/* Content */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-12 flex justify-center items-center gap-6 relative z-10 bg-dashed">
        <div className="w-full px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center flex justify-center flex-col text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
              Ready to polish your Coolify dashboard?
            </div>
            <div className="self-stretch text-center text-muted-foreground text-base leading-7 font-sans font-medium">
              Install Coolify Tweaks in minutes and transform your dashboard
              <br />
              with better spacing, typography, and colors.
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-12">
            <div className="flex justify-start items-center gap-4">
              <Link
                href="/docs/style"
                className="h-10 px-12 py-[6px] relative bg-primary text-primary-foreground overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <div className="flex flex-col justify-center text-[13px] font-medium leading-5 font-sans">
                  Read The Docs
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

