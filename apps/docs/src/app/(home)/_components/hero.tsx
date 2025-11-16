"use client";

import { useState } from "react";
import Link from "next/link";
import { useInterval } from "usehooks-ts";
import { BlurImage } from "@/components/blur-image";
import { FeatureCard } from "./feature-card";
import { Button } from "@repo/ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@repo/ui";

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
    description: "Refined spacing, typography, and colors for a more polished interface.",
    image: {
      light: "/assets/hero-light.png",
      dark: "/assets/hero-dark.png",
    },
  },
  {
    title: "Custom themes",
    description: "Use built-in themes or bring your own. Fully customizable to match your preferences and brand.",
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

  useInterval(
    () => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 2;
        }
        return prev + 2;
      });
    },
    100
  );

  useInterval(
    () => {
      if (progress >= 100) {
        setActiveCard((current) => (current + 1) % FEATURES_HERO.length);
        setProgress(0);
      }
    },
    100
  );

  const handleCardClick = (index: number) => {
    setActiveCard(index);
    setProgress(0);
  };

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0 gap-6">
      <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-2">
        <div className="w-full text-center flex justify-center flex-col text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-tight px-2 sm:px-4 md:px-0">
          Polish your Coolify dashboard
        </div>
        <div className="w-full text-center flex justify-center flex-col text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed px-2 sm:px-4 md:px-0">
          A style layer that refines spacing, typography, and colorwork.
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center relative z-10">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-1/2 -translate-x-1/2",
            "top-[48px]",
            "w-[380px] h-[320px] sm:w-[520px] sm:h-[360px]",
            "bg-radial-[at_center]",
            "from-primary/35 from-10%",
            "via-primary/20 via-35%",
            "to-transparent to-90%",
            "opacity-80 blur-3xl"
          )}
        />

        <div className="relative">
          <Button
            variant="default"
            size="lg"
            className="rounded-full h-9 md:h-11 lg:h-12 sm:px-6! md:px-8! lg:px-12! group/button bg-linear-to-r from-primary via-primary/80 to-primary/70 relative z-10"
            asChild
          >
            <Link href="/docs/style">
              Read The Docs
              <ArrowUpRight className='group-hover/button:-rotate-12 size-4 transition-transform' />
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-full pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-10 my-8 lg:pb-0">
        <div className="w-full aspect-video overflow-hidden rounded-sm sm:rounded-md md:rounded-lg lg:rounded-xl flex flex-col justify-start items-start">
          <div className="relative w-full h-full overflow-hidden">
            {FEATURES_HERO.map((feature, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${activeCard === index ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
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

      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>
        <div className="flex-1 flex flex-col md:flex-row justify-center items-stretch gap-0 border-t md:divide-x divide-border">
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
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>
      </div>
    </div>
  );
}

