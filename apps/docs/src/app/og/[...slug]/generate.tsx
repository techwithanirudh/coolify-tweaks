import { readFileSync } from "node:fs";
import type { ImageResponseOptions } from "@takumi-rs/image-response";
import type { ReactNode } from "react";

import { title as siteName } from "@/lib/layout.shared";

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  tag?: string;
}

const font = readFileSync("./src/app/og/[...slug]/fonts/Inter-Regular.ttf");
const fontSemiBold = readFileSync(
  "./src/app/og/[...slug]/fonts/Inter-SemiBold.ttf",
);
const fontBold = readFileSync("./src/app/og/[...slug]/fonts/Inter-Bold.ttf");
const fontPixy = readFileSync("./src/app/og/[...slug]/fonts/Pixy-Regular.ttf");

export function getImageResponseOptions(): ImageResponseOptions {
  return {
    format: "webp",
    width: 1200,
    height: 630,
    persistentImages: [
      {
        src: "logo.svg",
        data: readFileSync("./public/logo.svg"),
      },
    ],
    fonts: [
      {
        name: "Inter",
        data: font,
        weight: 400,
      },
      {
        name: "Inter",
        data: fontSemiBold,
        weight: 500,
      },
      {
        name: "Inter",
        data: fontBold,
        weight: 700,
      },
      {
        name: "Pixy",
        data: fontPixy,
        weight: 400,
      },
    ],
  };
}

export function generate({ title, description, tag }: GenerateProps) {
  const primaryTextColor = "rgb(240,240,240)";
  const primaryColor = "rgb(123, 111, 111)";
  const gridColor = "rgba(123, 111, 111, 0.2)"; // subtler grid tone

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: "white",
        backgroundColor: "#0c0c0c",
        backgroundImage: `linear-gradient(to top right, ${primaryColor}, transparent), noise-v1(opacity(0.3) frequency(1.0) octaves(4))`,
      }}
    >
      <div
        style={{
          background: "#000",
          backgroundImage: `
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
        `,
          backgroundSize: "25px 25px",
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "4rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "24px",
            marginBottom: "auto",
            color: primaryTextColor,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="logo.svg"
            alt={siteName}
            style={{ width: 60, height: 60 }}
          />
          <span
            style={{
              fontSize: "46px",
              fontWeight: 600,
            }}
          >
            {siteName}
          </span>
        </div>
        <p
          style={{
            fontWeight: 600,
            fontSize: "26px",
            textTransform: "uppercase",
          }}
        >
          {tag?.replace(/-/g, " ")}
        </p>
        <span
          style={{
            fontWeight: 600,
            fontSize: "76px",
            fontFamily: "Pixy",
            marginLeft: "1px",
          }}
        >
          {title}
        </span>
        <p
          style={{
            fontSize: "48px",
            color: "#a0a0a0",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
