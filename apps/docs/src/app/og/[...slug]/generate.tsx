import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ImageResponseOptions } from "@takumi-rs/image-response";
import type { ReactNode } from "react";

import { title as siteName } from "@/lib/layout.shared";

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  tag?: string;
}

const fontsDir = join(process.cwd(), "src/app/og/[...slug]/fonts");

const geistThin = readFileSync(join(fontsDir, "Geist-Thin.ttf"));
const geistRegular = readFileSync(join(fontsDir, "Geist-Regular.ttf"));
const geistMedium = readFileSync(join(fontsDir, "Geist-Medium.ttf"));
const geistSemiBold = readFileSync(join(fontsDir, "Geist-SemiBold.ttf"));
const geistBold = readFileSync(join(fontsDir, "Geist-Bold.ttf"));
const geistExtraBold = readFileSync(join(fontsDir, "Geist-ExtraBold.ttf"));

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
        name: "Geist",
        data: geistThin,
        weight: 100,
        style: "normal",
      },
      {
        name: "Geist",
        data: geistRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Geist",
        data: geistMedium,
        weight: 500,
        style: "normal",
      },
      {
        name: "Geist",
        data: geistSemiBold,
        weight: 600,
        style: "normal",
      },
      {
        name: "Geist",
        data: geistBold,
        weight: 700,
        style: "normal",
      },
      {
        name: "Geist",
        data: geistExtraBold,
        weight: 800,
        style: "normal",
      },
    ],
  };
}

export function generate({ title, description, tag }: GenerateProps) {
  const backgroundColor = "rgb(59, 59, 64)";
  const primaryTextColor = "rgb(253, 253, 253)";
  const primaryColor = "rgb(168, 141, 212)";
  const gridColor = "rgba(78, 75, 85, 0.4)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: primaryTextColor,
        backgroundColor: backgroundColor,
        backgroundImage: `linear-gradient(to top right, ${primaryColor}, transparent), noise-v1(opacity(0.3) frequency(1.0) octaves(4))`,
      }}
    >
      <div
        style={{
          background: backgroundColor,
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
            gap: "16px",
            marginBottom: "auto",
            color: primaryTextColor,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="logo.svg"
            alt={siteName}
            style={{ width: 60, height: 60, borderRadius: "16px" }}
          />
          <span
            style={{
              fontSize: "46px",
              fontWeight: 600,
              fontFamily: "Geist",
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
            fontFamily: "Geist",
          }}
        >
          {tag?.replace(/-/g, " ")}
        </p>
        <span
          style={{
            fontWeight: 700,
            fontSize: "76px",
            fontFamily: "Geist",
            marginLeft: "1px",
          }}
        >
          {title}
        </span>
        <p
          style={{
            fontSize: "48px",
            color: "rgba(253, 253, 253, 0.7)", // --foreground with reduced opacity
            fontFamily: "Geist",
            fontWeight: 400,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
