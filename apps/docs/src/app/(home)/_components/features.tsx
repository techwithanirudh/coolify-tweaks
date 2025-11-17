import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Download, Github, Grid2X2, Palette, Sparkles } from "lucide-react";

import { cn } from "@repo/ui";
import { Badge } from "@repo/ui/badge";

import { BlurImage } from "@/components/blur-image";
import { getRepoStarsAndForks, owner, repo } from "@/lib/github";
import { GitHubShowcase } from "./features/github-showcase";
import InstallMethods from "./features/install-methods";
import { ThemeShowcase } from "./features/theme-showcase";

interface Feature {
  Icon: LucideIcon;
  name: string;
  description: string;
  className?: string;
  background: ReactNode;
}

function getFeatures(stars: number): Feature[] {
  return [
    {
      Icon: Sparkles,
      name: "Better UI",
      description:
        "Refined spacing, typography, and colors for a more polished Coolify dashboard.",
      background: (
        <div className="bg-card border-border relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border">
          <BlurImage
            src="/assets/hero-light.png"
            alt="Coolify Tweaks Dashboard"
            fill
            imageClassName="object-cover dark:hidden"
          />
          <BlurImage
            src="/assets/hero-dark.png"
            alt="Coolify Tweaks Dashboard"
            fill
            imageClassName="object-cover hidden dark:block"
          />
        </div>
      ),
    },
    {
      Icon: Palette,
      name: "Custom themes",
      description:
        "Use built-in themes or bring your own. Fully customizable to match your preferences and brand.",
      className: "overflow-hidden",
      background: (
        <div className="relative flex aspect-video w-full items-center justify-center overflow-visible rounded-lg">
          <ThemeShowcase className="h-full w-full" />
        </div>
      ),
    },
    {
      Icon: Download,
      name: "Many install methods",
      description:
        "Install directly through Traefik or use Stylus. Works with any Coolify instance and fully customizable.",
      className: "bg-transparent",
      background: (
        <div className="bg-card border-border aspect-video w-full overflow-hidden rounded-lg border">
          <div className="size-full overflow-y-auto p-1 sm:p-3">
            <InstallMethods className="size-full" />
          </div>
        </div>
      ),
    },
    {
      Icon: Github,
      name: "Fully open-source",
      description:
        "Built in the open with community contributions. View the code, suggest improvements, or fork your own version.",
      background: (
        <div className="bg-card border-border relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border">
          <GitHubShowcase owner={owner} repo={repo} stars={stars} />
        </div>
      ),
    },
  ];
}

export async function Features() {
  const { stars } = await getRepoStarsAndForks(owner, repo);
  const features = getFeatures(stars);

  return (
    <section className="flex w-full flex-col items-center justify-center">
      <div className="border-border flex items-center justify-center self-stretch border-b px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-0 lg:py-24">
        <div className="flex w-full flex-col items-center justify-start gap-3 sm:gap-4">
          <Badge
            variant="secondary"
            className="border-border group/badge h-fit border px-2 py-1 text-sm shadow-xs"
          >
            <Grid2X2 className="transition-transform duration-200 group-hover/badge:scale-110 group-hover/badge:-rotate-12" />
            <span>Features</span>
          </Badge>
          <div className="flex w-full flex-col justify-center text-center text-xl leading-tight font-semibold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl">
            Polished spacing, typography, and colors
          </div>
          <div className="text-muted-foreground self-stretch text-center text-sm leading-6 font-normal sm:text-base">
            A style layer that refines spacing, typography, and colors.
            <br />
            Keeps the interface familiar while smoothing out rough edges.
          </div>
        </div>
      </div>

      <div className="flex items-start justify-center self-stretch">
        <div className="bg-dashed w-4 self-stretch sm:w-6 md:w-8 lg:w-12"></div>

        <div className="border-border divide-border grid flex-1 grid-cols-1 gap-0 divide-y border-r border-l md:grid-cols-2 md:divide-y-0">
          {features.map((feature) => (
            <div
              key={feature.name}
              className={cn(
                "flex flex-col items-start justify-start gap-4 p-4 sm:gap-6 sm:p-6 md:p-8 lg:p-12",
                "nth-[-n+2]:border-border nth-[-n+2]:border-b",
                "odd:border-border odd:border-r-0 md:odd:border-r",
                feature.className,
              )}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg leading-tight font-semibold sm:text-xl">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-normal md:text-base">
                  {feature.description}
                </p>
              </div>
              {feature.background}
            </div>
          ))}
        </div>

        <div className="bg-dashed w-4 self-stretch sm:w-6 md:w-8 lg:w-12"></div>
      </div>
    </section>
  );
}
