'use client'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/fumadocs/cn'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

function CollapsibleContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <CollapsiblePrimitive.CollapsibleContent
      {...props}
      className={cn(
        'overflow-hidden',
        mounted &&
          'data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down',
        className
      )}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  )
}

CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }