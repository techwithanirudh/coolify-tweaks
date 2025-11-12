"use client";

export function EffortlessIntegration({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center ${className || ""}`}
      style={{ width, height }}
    >
      <div className="text-[#605A57] text-sm">Effortless integration</div>
    </div>
  );
}

