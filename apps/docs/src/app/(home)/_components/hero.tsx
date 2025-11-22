"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useInterval } from "usehooks-ts";

import { cn } from "@repo/ui";
import { Button } from "@repo/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/ui/hover-card";

import { BlurImage } from "@/components/blur-image";
import { FeatureCard } from "./feature-card";

interface FeatureHero {
  title: string;
  description: string;
  image: {
    light: string;
    dark: string;
  };
}

const FEATURES_HERO: FeatureHero[] = [
  {
    title: "Better UI",
    description:
      "Refined spacing, typography, and colors for a more polished interface.",
    image: {
      light: "/assets/hero-light.png",
      dark: "/assets/hero-dark.png",
    },
  },
  {
    title: "Custom themes",
    description:
      "Use built-in themes or bring your own. Fully customizable to match your preferences and brand.",
    image: {
      light: "/assets/themes/claude-light.png",
      dark: "/assets/themes/claude-dark.png",
    },
  },
  // {
  //   title: "Many install methods",
  //   description: "Install directly through Traefik or use Stylus. Works with any Coolify instance and fully customizable.",
  //   image: {
  //     light: "/assets/screenshots/new-resource-page_original.png",
  //     dark: "/assets/screenshots/new-resource-page_themed.png",
  //   },
  // },
];

export function Hero() {
  const [activeCard, setActiveCard] = useState(0);
  const [progress, setProgress] = useState(0);

  useInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        return 2;
      }
      return prev + 2;
    });
  }, 100);

  useInterval(() => {
    if (progress >= 100) {
      setActiveCard((current) => (current + 1) % FEATURES_HERO.length);
      setProgress(0);
    }
  }, 100);

  const handleCardClick = (index: number) => {
    setActiveCard(index);
    setProgress(0);
  };

  return (
    <div className="flex w-full flex-col items-center justify-start gap-6 px-2 pt-16 pr-0 pl-0 sm:px-4 sm:pt-20 sm:pr-0 sm:pl-0 md:px-8 md:pt-24 lg:px-0">
      <div className="flex flex-col items-center justify-center gap-2 self-stretch rounded-[3px]">
        <div className="w-full px-2 text-center text-2xl leading-tight font-normal sm:px-4 sm:text-3xl md:px-0 md:text-4xl lg:text-5xl">
          Theme your{" "}
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="group/trademark inline-flex cursor-help items-center gap-1.5">
                Coolify
                <Sparkles className="text-muted-foreground/60 group-hover/trademark:text-primary size-4 transition-colors sm:size-5 md:size-6" />
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium">Trademark Notice</div>
                <div className="text-muted-foreground text-xs leading-relaxed">
                  Coolify is trademark of coolLabs Technologies Bt. Coolify
                  Tweaks is not affiliated with or endorsed by coolLabs.
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          dashboard
        </div>
        <div className="text-muted-foreground flex w-full flex-col justify-center px-2 text-center text-sm leading-relaxed sm:px-4 sm:text-base md:px-0 md:text-lg">
          A theme that refines spacing, typography, and colors.
        </div>
      </div>
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-1/2 -translate-x-1/2",
            "top-[48px]",
            "h-[320px] w-[380px] sm:h-[360px] sm:w-[520px]",
            "bg-radial-[at_center]",
            "from-primary/35 from-10%",
            "via-primary/20 via-35%",
            "to-transparent to-90%",
            "opacity-80 blur-3xl",
          )}
        />

        <div className="relative">
          <Button
            variant="default"
            size="lg"
            className="group/button from-primary via-primary/80 to-primary/70 relative z-10 h-9 rounded-full bg-linear-to-r sm:px-6! md:h-11 md:px-8! lg:h-12 lg:px-12!"
            asChild
          >
            <Link href="/docs/style">
              Read The Docs
              <ArrowUpRight className="size-4 transition-transform group-hover/button:-rotate-12" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative z-10 my-8 flex w-full flex-col items-center justify-center gap-2 px-2 pt-2 pb-6 sm:px-4 sm:pt-4 sm:pb-8 md:px-6 md:pb-10 lg:px-11 lg:pb-0">
        <div className="flex aspect-video w-full flex-col items-start justify-start overflow-hidden rounded-sm sm:rounded-md md:rounded-lg lg:rounded-xl">
          <div className="relative h-full w-full overflow-hidden">
            {FEATURES_HERO.map((feature, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  activeCard === index
                    ? "blur-0 scale-100 opacity-100"
                    : "scale-95 opacity-0 blur-sm"
                }`}
              >
                <BlurImage
                  src={feature.image.light}
                  alt={`Coolify Tweaks - ${feature.title}`}
                  fill
                  lazy={index !== 0}
                  imageClassName={`object-cover dark:hidden rounded-sm sm:rounded-md md:rounded-lg lg:rounded-xl`}
                />
                <BlurImage
                  src={feature.image.dark}
                  alt={`Coolify Tweaks - ${feature.title}`}
                  fill
                  lazy={index !== 0}
                  imageClassName={`object-cover hidden dark:block rounded-sm sm:rounded-md md:rounded-lg lg:rounded-xl`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start justify-center self-stretch">
        <div className="bg-dashed w-4 self-stretch sm:w-6 md:w-8 lg:w-12"></div>
        <div className="divide-border flex flex-1 flex-col items-stretch justify-center gap-0 border-t md:flex-row md:divide-x">
          {FEATURES_HERO.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              isActive={activeCard === index}
              progress={activeCard === index ? progress : 0}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
        <div className="bg-dashed w-4 self-stretch sm:w-6 md:w-8 lg:w-12"></div>
      </div>
    </div>
  );
}
