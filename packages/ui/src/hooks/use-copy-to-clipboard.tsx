"use client";

import * as React from "react";
import { toast } from "sonner";
import { CopyCheckIcon } from "lucide-react";

export interface useCopyToClipboardProps {
  timeout?: number;
}

export function useCopyToClipboard({
  timeout = 2000,
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined") {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    void navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      toast.success('Copied to clipboard!', {
        icon: <CopyCheckIcon className='size-4' />,
        description: 'The value has been copied to your clipboard.',
      });
      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard };
}
