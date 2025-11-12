"use client";

import { useState } from "react";
import Link from "next/link";
import { useInterval } from "usehooks-ts";
import { BlurImage } from "@/components/blur-image";
import { FeatureCard } from "./feature-card";

const FEATURES = [
  {
    title: "Better UI",
    description: "Improved spacing, typography, and colors make your Coolify dashboard feel polished and intentional.",
    image: {
      light: "/assets/screenshots/dashboard-grid_original.png",
      dark: "/assets/screenshots/dashboard-grid_themed.png",
    },
  },
  {
    title: "Custom themes",
    description: "Use built-in themes or bring your own. Fully customizable to match your preferences and brand.",
    image: {
      light: "/assets/screenshots/servers-page_original.png",
      dark: "/assets/screenshots/servers-page_themed.png",
    },
  },
  {
    title: "Many install methods",
    description: "Install directly through Traefik or use Stylus. Works with any Coolify instance and fully customizable.",
    image: {
      light: "/assets/screenshots/new-resource-page_original.png",
      dark: "/assets/screenshots/new-resource-page_themed.png",
    },
  },
] as const;

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
        setActiveCard((current) => (current + 1) % FEATURES.length);
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
    <div className="pt-16 sm:pt-20 md:pt-24 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
      <div className="w-full flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-2">
          <div className="w-full text-center flex justify-center flex-col text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-tight px-2 sm:px-4 md:px-0">
            Polished Coolify dashboard
          </div>
          <div className="w-full text-center flex justify-center flex-col text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed px-2 sm:px-4 md:px-0">
            Layer polished spacing, typography on top of Coolify.
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-4">
        <div className="flex justify-start items-center gap-4">
          <Link
            href="/docs/style"
            className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative bg-primary text-primary-foreground overflow-hidden rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors"
          >
            <div className="flex flex-col justify-center text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans">
              Read The Docs
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0">
        <div className="w-full aspect-video overflow-hidden rounded-sm sm:rounded-md md:rounded-lg lg:rounded-xl flex flex-col justify-start items-start">
          <div className="self-stretch flex-1 flex justify-start items-start">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden">
                {FEATURES.map((feature, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      activeCard === index ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
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
        </div>
      </div>

      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>
        <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0 border-t md:divide-x divide-border">
          {FEATURES.map((feature, index) => (
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

