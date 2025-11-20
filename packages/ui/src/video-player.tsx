import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

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
    <>
      <style>
        {`
        [data-media-player] {
            --video-border: var(--border);
            --video-border-radius: var(--radius-md);
        }

        .vds-menu-items[data-root] {
            --root-border: var(--border)!important;
            --root-border-radius: var(--radius-lg)!important;
        }

        .vds-menu-items[data-root] .vds-menu-item {
            --item-border-radius: var(--radius-lg);
        }

        :where(.vds-menu-checkbox) {
            --media-menu-checkbox-width: 35px!important;
            --media-menu-checkbox-handle-diameter: calc(var(--checkbox-height) - 4px))!important;
        }

        :where(.vds-menu-item[aria-expanded=true]) {
            margin-bottom: 0px!important;
        }

        :where(.vds-menu-section) {
            margin-top: 0px!important;
        }
        `}
      </style>
      <MediaPlayer poster={poster} className={className} {...props}>
        <MediaProvider />
        <DefaultVideoLayout
          thumbnails={thumbnails}
          icons={defaultLayoutIcons}
          colorScheme={"default"}
        />
      </MediaPlayer>
    </>
  );
}
