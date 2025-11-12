"use client";

export function NumbersThatSpeak({
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
      <div className="text-[#605A57] text-sm">Numbers that speak</div>
    </div>
  );
}

