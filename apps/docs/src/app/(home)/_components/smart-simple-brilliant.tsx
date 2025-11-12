"use client";

export function SmartSimpleBrilliant({
  width,
  height,
  theme,
  className,
}: {
  width?: string;
  height?: string;
  theme?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center ${className || ""}`}
      style={{ width, height }}
    >
      <div className="text-[#605A57] text-sm">Smart. Simple. Brilliant.</div>
    </div>
  );
}

