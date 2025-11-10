'use client'

import * as React from 'react'

export interface useCopyToClipboardProps {
  timeout?: number
}

export function useCopyToClipboard({
  timeout = 2000
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined') {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.clipboard?.writeText) {
      return
    }

    if (!value) {
      return
    }

    void navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { isCopied, copyToClipboard }
}