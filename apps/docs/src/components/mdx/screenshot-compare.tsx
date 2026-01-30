import { ImageZoom } from "fumadocs-ui/components/image-zoom";

type ScreenshotSide = {
  alt: string;
  src: string;
};

type ScreenshotCompareProps = {
  title?: string;
  before: ScreenshotSide;
  after: ScreenshotSide;
};

export function ScreenshotCompare({
  title,
  before,
  after,
}: ScreenshotCompareProps) {
  return (
    <div className="not-prose my-6 rounded-xl border border-border/60 bg-fd-background/40 p-4">
      {title ? (
        <div className="text-sm font-semibold text-fd-muted-foreground">
          {title}
        </div>
      ) : null}
      <div className={title ? "mt-4 grid gap-4 md:grid-cols-2" : "grid gap-4 md:grid-cols-2"}>
        <figure className="flex flex-col gap-2">
          <figcaption className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
            Before
          </figcaption>
          <ImageZoom
            alt={before.alt}
            className="w-full rounded-lg border border-border/60"
            src={before.src}
          >
            <img
              alt={before.alt}
              className="w-full rounded-lg border border-border/60"
              src={before.src}
            />
          </ImageZoom>
        </figure>
        <figure className="flex flex-col gap-2">
          <figcaption className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
            After
          </figcaption>
          <ImageZoom
            alt={after.alt}
            className="w-full rounded-lg border border-border/60"
            src={after.src}
          >
            <img
              alt={after.alt}
              className="w-full rounded-lg border border-border/60"
              src={after.src}
            />
          </ImageZoom>
        </figure>
      </div>
    </div>
  );
}
