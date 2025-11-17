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
      className={`border-border relative flex w-full cursor-pointer flex-col items-start justify-start gap-2 self-stretch overflow-hidden border-b px-6 py-5 last:border-b-0 md:flex-1 md:border-b-0 md:first:border-l md:last:border-r ${
        isActive ? "bg-card -mt-px border-t-0" : ""
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="bg-border absolute top-0 left-0 h-px w-full">
          <div
            className="bg-primary h-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="flex flex-col justify-center self-stretch text-sm leading-6 font-semibold">
        {title}
      </div>
      <div className="text-muted-foreground self-stretch text-xs">
        {description}
      </div>
    </div>
  );
}
