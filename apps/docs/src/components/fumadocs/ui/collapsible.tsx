"use client";

import { forwardRef, useEffect, useState } from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { cn } from "@repo/ui";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ children, ...props }, ref) => {
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- mounted state initialization */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      {...props}
      className={cn(
        "overflow-hidden",
        mounted &&
          "data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down",
        props.className,
      )}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
});

CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
