"use client";

import { useTheme } from "next-themes";

import type { VideoPlayerProps as BaseVideoPlayerProps } from "@repo/ui/video-player";
import { VideoPlayer as BaseVideoPlayer } from "@repo/ui/video-player";

export type VideoPlayerProps = BaseVideoPlayerProps;

export function VideoPlayer(props: VideoPlayerProps) {
  const { theme } = useTheme();

  return (
    <BaseVideoPlayer
      {...props}
      colorScheme={
        theme as "light" | "dark" | "system" | undefined
      }
    />
  );
}
