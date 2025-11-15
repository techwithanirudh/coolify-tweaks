"use client";

export function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string;
  description: string;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b last:border-b-0 md:border-b-0 border-border md:first:border-l md:last:border-r ${
        isActive
          ? "bg-card border-t-0 -mt-px"
          : ""
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-px bg-border">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="self-stretch flex justify-center flex-col text-sm font-semibold leading-6">
        {title}
      </div>
      <div className="self-stretch text-muted-foreground text-xs">
        {description}
      </div>
    </div>
  );
}

