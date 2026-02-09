import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "./video-player.css";

import type { ComponentProps } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

export interface VideoPlayerProps extends ComponentProps<typeof MediaPlayer> {
  thumbnails?: string;
  poster?: string;
}

export function VideoPlayer({
  thumbnails,
  poster,
  className,
  ...props
}: VideoPlayerProps) {
  return (
    <MediaPlayer poster={poster} className={className} {...props}>
      <MediaProvider />
      <DefaultVideoLayout
        thumbnails={thumbnails}
        icons={defaultLayoutIcons}
        colorScheme={"default"}
      />
    </MediaPlayer>
  );
}
