"use client";

export function YourWorkInSync({
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
      <div className="text-[#605A57] text-sm">Your work, in sync</div>
    </div>
  );
}

