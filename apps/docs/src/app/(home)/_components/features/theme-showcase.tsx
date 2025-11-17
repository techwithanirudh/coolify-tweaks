"use client";

import type * as React from "react";
import { Autoplay, EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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

const SCREENSHOTS: Screenshot[] = [
  {
    light: "/assets/themes/claude-light.png",
    dark: "/assets/themes/claude-dark.png",
    alt: "Claude Theme",
  },
  {
    light: "/assets/themes/bubblegum-light.png",
    dark: "/assets/themes/bubblegum-dark.png",
    alt: "Bubblegum Theme",
  },
  {
    light: "/assets/themes/nature-light.png",
    dark: "/assets/themes/nature-dark.png",
    alt: "Nature Theme",
  },
  {
    light: "/assets/themes/soft-pop-light.png",
    dark: "/assets/themes/soft-pop-dark.png",
    alt: "Soft Pop Theme",
  },
  {
    light: "/assets/themes/t3-chat-light.png",
    dark: "/assets/themes/t3-chat-dark.png",
    alt: "T3 Chat Theme",
  },
  {
    light: "/assets/themes/vercel-light.png",
    dark: "/assets/themes/vercel-dark.png",
    alt: "Vercel Theme",
  },
];

export const ThemeShowcase: React.FC<ThemeShowcaseProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`h-full w-full ${className}`}
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
        className={`h-full w-full`}
        loop={true}
        cardsEffect={{
          perSlideOffset: 2,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: true,
        }}
      >
        {SCREENSHOTS.map((screenshot, index) => (
          <SwiperSlide
            key={index}
            className="border-border relative rounded-lg border"
          >
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
