import { readFile } from "node:fs/promises";
import type { ImageResponseOptions } from "@takumi-rs/image-response";
import type { ReactNode } from "react";

import { title as siteName } from "@/lib/layout.shared";

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  tag?: string;
}

const logo = readFile("./public/logo.svg").then((data) => ({
  src: "logo.svg",
  data,
}));

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    format: "webp",
    width: 1200,
    height: 630,
    persistentImages: [await logo],
  };
}

export function generate({ title, description, tag }: GenerateProps) {
  const backgroundColor = "rgb(59, 59, 64)";
  const primaryTextColor = "rgb(253, 253, 253)";
  const primaryColor = "rgb(168, 141, 212)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: primaryTextColor,
        backgroundColor: backgroundColor,
        backgroundImage: `linear-gradient(to top right, ${primaryColor}, transparent)`,
      }}
    >
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
