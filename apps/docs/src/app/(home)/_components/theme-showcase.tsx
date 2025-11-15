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

const THEMED_SCREENSHOTS = [
  {
    src: "/assets/screenshots/dashboard-grid_themed.png",
    alt: "Dashboard Grid - Themed",
  },
  {
    src: "/assets/screenshots/servers-page_themed.png",
    alt: "Servers Page - Themed",
  },
  {
    src: "/assets/screenshots/new-resource-page_themed.png",
    alt: "New Resource Page - Themed",
  },
  {
    src: "/assets/screenshots/resource-logs-page_themed.png",
    alt: "Resource Logs - Themed",
  },
  {
    src: "/assets/screenshots/environments-page_themed.png",
    alt: "Environments Page - Themed",
  },
  {
    src: "/assets/screenshots/profile-page_themed.png",
    alt: "Profile Page - Themed",
  },
];

/**
 * Theme Showcase Component
 * Displays themed screenshots in a vertical carousel with autoplay
 */
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
          <SwiperSlide key={index}>
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <BlurImage
                src={screenshot.src}
                alt={screenshot.alt}
                fill
                imageClassName="object-cover rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
