"use client";

import { Badge } from "./badge";
import { SmartSimpleBrilliant } from "./smart-simple-brilliant";
import { YourWorkInSync } from "./your-work-in-sync";
import { EffortlessIntegration } from "./effortless-integration-updated";
import { NumbersThatSpeak } from "./numbers-that-speak";

export function Features() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 py-8 sm:py-12 md:py-16 border-b border-border flex justify-center items-center gap-6">
        <div className="w-full px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
              </svg>
            }
            text="Features"
          />
          <div className="w-full text-center flex justify-center flex-col text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Polished spacing, typography, and colors
          </div>
          <div className="self-stretch text-center text-muted-foreground text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
            Layer polished spacing, typography, and colorwork on top of Coolify's dashboard.
            <br />
            Keep the UI familiar while smoothing out rough edges.
          </div>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-border">
          {/* Top Left - Better UI */}
          <div className="border-b border-r-0 md:border-r border-border p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-semibold leading-tight font-sans">
                Better UI
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed font-sans">
                Improved spacing, typography, and colors make your Coolify dashboard feel polished and intentional.
              </p>
            </div>
            <div className="w-full aspect-video rounded-lg flex items-center justify-center overflow-hidden bg-card border border-border">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dsadsadsa.jpg-xTHS4hGwCWp2H5bTj8np6DXZUyrxX7.jpeg"
                alt="Coolify Tweaks Dashboard Screenshot"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Top Right - Custom themes */}
          <div className="border-b border-border p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold leading-tight font-sans text-lg sm:text-xl">
                Custom themes
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed font-sans">
                Use built-in themes or bring your own. Fully customizable to match your preferences and brand.
              </p>
            </div>
            <div className="w-full aspect-video rounded-lg flex overflow-hidden text-right items-center justify-center bg-card border border-border">
              <YourWorkInSync
                width="400"
                height="250"
                theme="light"
                className="scale-60 sm:scale-75 md:scale-90"
              />
            </div>
          </div>

          {/* Bottom Left - Many install methods */}
          <div className="border-r-0 md:border-r border-border p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 bg-transparent">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-semibold leading-tight font-sans">
                Many install methods
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed font-sans">
                Install directly through Traefik or use Stylus. Works with any Coolify instance and fully customizable.
              </p>
            </div>
            <div className="w-full aspect-video rounded-lg flex overflow-hidden justify-center items-center relative bg-transparent">
              <div className="w-full h-full flex items-center justify-center bg-transparent">
                <EffortlessIntegration width={400} height={250} className="max-w-full max-h-full" />
              </div>
              {/* Gradient mask for soft bottom edge */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Bottom Right - Fully open-source */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-semibold leading-tight font-sans">
                Fully open-source
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed font-sans">
                Built in the open with community contributions. View the code, suggest improvements, or fork your own version.
              </p>
            </div>
            <div className="w-full aspect-video rounded-lg flex overflow-hidden items-center justify-center relative bg-card border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <NumbersThatSpeak
                  width="100%"
                  height="100%"
                  theme="light"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>
      </div>
    </div>
  );
}

