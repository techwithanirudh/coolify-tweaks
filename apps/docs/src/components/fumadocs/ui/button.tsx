import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      color: {
        primary:
          "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80",
        outline: "hover:bg-fd-accent hover:text-fd-accent-foreground border",
        ghost: "hover:bg-fd-accent hover:text-fd-accent-foreground",
        secondary:
          "bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground border",
      },
      size: {
        sm: "gap-1 p-1 text-xs",
        icon: "p-1.5 [&_svg]:size-5",
        "icon-sm": "p-1.5 [&_svg]:size-4.5",
      },
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;
