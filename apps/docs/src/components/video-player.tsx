"use client";

import type { ComponentProps, ReactElement } from "react";
import {
  VideoPlayer as BaseVideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@repo/ui/kibo-ui/video-player";
import { cn } from "@repo/ui";

export type VideoPlayerProps = Omit<
  ComponentProps<typeof BaseVideoPlayer>,
  "children"
> & {
  children: ReactElement<ComponentProps<typeof VideoPlayerContent>>;
};

export function VideoPlayer({
  className,
  children,
  ...props
}: VideoPlayerProps) {
  return (
    <BaseVideoPlayer className={cn("overflow-hidden rounded-lg border", className)} {...props}>
      {children}
      <VideoPlayerControlBar>
        <VideoPlayerPlayButton />
        <VideoPlayerSeekBackwardButton />
        <VideoPlayerSeekForwardButton />
        <VideoPlayerTimeRange />
        <VideoPlayerTimeDisplay showDuration />
        <VideoPlayerMuteButton />
        <VideoPlayerVolumeRange />
      </VideoPlayerControlBar>
    </BaseVideoPlayer>
  );
}

export { VideoPlayerContent };

