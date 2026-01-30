/* eslint-disable @next/next/no-img-element */
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

interface ScreenshotSide {
  alt: string;
  src: string;
}

interface ScreenshotCompareProps {
  title?: string;
  before: ScreenshotSide;
  after: ScreenshotSide;
}

export function ScreenshotCompare({
  title,
  before,
  after,
}: ScreenshotCompareProps) {
  return (
    <div className="not-prose border-border/60 bg-fd-background/40 my-6 rounded-xl border p-4">
      {title ? (
        <div className="text-fd-muted-foreground text-sm font-semibold">
          {title}
        </div>
      ) : null}
      <div
        className={
          title ? "mt-4 grid gap-4 md:grid-cols-2" : "grid gap-4 md:grid-cols-2"
        }
      >
        <figure className="flex flex-col gap-2">
          <figcaption className="text-fd-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Before
          </figcaption>
          <ImageZoom
            alt={before.alt}
            className="border-border/60 w-full rounded-lg border"
            src={before.src}
          >
            <img
              alt={before.alt}
              className="border-border/60 w-full rounded-lg border"
              src={before.src}
            />
          </ImageZoom>
        </figure>
        <figure className="flex flex-col gap-2">
          <figcaption className="text-fd-muted-foreground text-xs font-semibold tracking-wide uppercase">
            After
          </figcaption>
          <ImageZoom
            alt={after.alt}
            className="border-border/60 w-full rounded-lg border"
            src={after.src}
          >
            <img
              alt={after.alt}
              className="border-border/60 w-full rounded-lg border"
              src={after.src}
            />
          </ImageZoom>
        </figure>
      </div>
    </div>
  );
}
