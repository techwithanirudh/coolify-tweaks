'use client';
import { cn } from '@repo/ui';
import type { HTMLMotionProps } from 'motion/react';
import { motion } from 'motion/react';

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & HTMLMotionProps<'div'>;

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 12,
  className,
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);

  return (
    <div className={cn('relative', className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const progress = index / (layers - 1);
        const blurAmount = Math.pow(progress, 1.5) * blurIntensity * layers;

        const gradientStops = [
          `rgba(0, 0, 0, 0) ${Math.max(0, (progress - 0.1) * 100)}%`,
          `rgba(0, 0, 0, ${Math.min(1, progress * 2)}) ${progress * 100}%`,
          `rgba(0, 0, 0, 1) ${Math.min(100, (progress + 0.1) * 100)}%`,
        ];

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(', ')})`;

        return (
          <motion.div
            key={index}
            className='pointer-events-none absolute inset-0 rounded-[inherit]'
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}
