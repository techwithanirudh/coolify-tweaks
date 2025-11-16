import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@repo/ui/badge";
import { Grid2X2, Sparkles, Palette, Download, Github } from "lucide-react";
import { BlurImage } from "@/components/blur-image";
import InstallMethods from "./features/install-methods";
import { ThemeShowcase } from "./features/theme-showcase";
import { GitHubShowcase } from "./features/github-showcase";
import { owner, repo, getRepoStarsAndForks } from "@/lib/github";
import { cn } from "@repo/ui";

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
        <div className="w-full aspect-video rounded-lg flex items-center justify-center overflow-hidden bg-card border border-border relative">
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
        <div className="w-full aspect-video rounded-lg flex items-center justify-center overflow-visible relative">
          <ThemeShowcase className="w-full h-full" />
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
        <div className="w-full aspect-video rounded-lg bg-card border border-border overflow-hidden">
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
        <div className="w-full aspect-video rounded-lg flex overflow-hidden items-center justify-center relative bg-card border border-border">
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
    <section className="w-full flex flex-col justify-center items-center">
      <div className="self-stretch px-6 sm:px-8 md:px-12 lg:px-0 py-12 sm:py-16 md:py-20 lg:py-24 border-b border-border flex justify-center items-center">
        <div className="w-full flex flex-col justify-start items-center gap-3 sm:gap-4">
          <Badge
            variant="secondary"
            className="border-border h-fit shadow-xs border px-2 py-1 text-sm group/badge"
          >
            <Grid2X2 className="group-hover/badge:scale-110 group-hover/badge:-rotate-12 transition-transform duration-200" />
            <span>Features</span>
          </Badge>
          <div className="w-full text-center flex justify-center flex-col text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight tracking-tight">
            Polished spacing, typography, and colors
          </div>
          <div className="self-stretch text-center text-muted-foreground text-sm sm:text-base font-normal leading-6">
            A style layer that refines spacing, typography, and colorwork.
            <br />
            Keeps the interface familiar while smoothing out rough edges.
          </div>
        </div>
      </div>

      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-border divide-y md:divide-y-0 divide-border">
          {features.map((feature) => (
            <div
              key={feature.name}
              className={cn(
                "p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6",
                "nth-[-n+2]:border-b nth-[-n+2]:border-border",
                "odd:border-r-0 md:odd:border-r odd:border-border",
                feature.className
              )}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed">
                  {feature.description}
                </p>
              </div>
              {feature.background}
            </div>
          ))}
        </div>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>
      </div>
    </section>
  );
}

