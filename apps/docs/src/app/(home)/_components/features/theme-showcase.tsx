"use client";

import type * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import { BlurImage } from "@/components/blur-image";

import "swiper/css";
import "swiper/css/effect-cards";

interface ThemeShowcaseProps {
  className?: string;
}

interface Screenshot {
  light: string;
  dark: string;
  alt: string;
}

const THEMED_SCREENSHOTS: Screenshot[] = [
  {
    light: "/assets/screenshots/dashboard-grid_original.png",
    dark: "/assets/screenshots/dashboard-grid_themed.png",
    alt: "Dashboard Grid - Themed",
  },
  {
    light: "/assets/screenshots/servers-page_original.png",
    dark: "/assets/screenshots/servers-page_themed.png",
    alt: "Servers Page - Themed",
  },
  {
    light: "/assets/screenshots/new-resource-page_original.png",
    dark: "/assets/screenshots/new-resource-page_themed.png",
    alt: "New Resource Page - Themed",
  },
  {
    light: "/assets/screenshots/resource-logs-page_original.png",
    dark: "/assets/screenshots/resource-logs-page_themed.png",
    alt: "Resource Logs - Themed",
  },
  {
    light: "/assets/screenshots/environments-page_original.png",
    dark: "/assets/screenshots/environments-page_themed.png",
    alt: "Environments Page - Themed",
  },
  {
    light: "/assets/screenshots/profile-page_original.png",
    dark: "/assets/screenshots/profile-page_themed.png",
    alt: "Profile Page - Themed",
  },
];

export const ThemeShowcase: React.FC<ThemeShowcaseProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`w-full h-full ${className}`}
      style={{
        position: "relative",
      }}
    >
      <Swiper
        effect="cards"
        grabCursor={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[EffectCards, Autoplay]}
        className={`w-full h-full`}
        loop={true}
        cardsEffect={{
          perSlideOffset: 2,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: true,
        }}
      >
        {THEMED_SCREENSHOTS.map((screenshot, index) => (
          <SwiperSlide key={index} className="rounded-lg border border-border relative">
            <BlurImage
              src={screenshot.light}
              alt={screenshot.alt}
              fill
              imageClassName="object-cover rounded-lg dark:hidden"
            />
            <BlurImage
              src={screenshot.dark}
              alt={screenshot.alt}
              fill
              imageClassName="object-cover rounded-lg hidden dark:block"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
