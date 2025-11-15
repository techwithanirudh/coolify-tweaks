import * as motion from "motion/react-client";
import { cn } from "@repo/ui";

interface ShimmerProps {
  className?: string;
  text: string;
  color?: string;
  midColor?: string;
}

export function Shimmer({
  className,
  text,
  color = "#222",
  midColor = "#fff",
}: ShimmerProps) {
  return (
    <motion.span
      animate={{ backgroundPosition: "-200% 0" }}
      className={cn("bg-clip-text text-transparent", className)}
      initial={{ backgroundPosition: "200% 0" }}
      style={{
        backgroundImage: `linear-gradient(110deg, ${color} 35%, ${midColor} 50%, ${color} 75%, ${color})`,
        backgroundSize: "200% 100%",
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  );
}