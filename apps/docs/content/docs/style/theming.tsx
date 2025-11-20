"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useInterval, useLocalStorage, useSessionStorage } from "usehooks-ts";

import { Button } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/button-group";
import { Card } from "@repo/ui/card";
import { useCopyToClipboard } from "@repo/ui/hooks/use-copy-to-clipboard";
import { Input } from "@repo/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/input-group";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";

const placeholders = ["claude", "caffeine", "cyberpunk", "violet-bloom"];

export type Mode = "stylus" | "dynamic";

interface ModeContentContextValue {
  mode: Mode;
  mounted: boolean;
  themeId: string;
}

const ModeContentContext = createContext<ModeContentContextValue | null>(null);

export function useModeContent() {
  const context = useContext(ModeContentContext);
  if (!context) {
    throw new Error("useModeContent must be used within a ModeContentProvider");
  }

  return context;
}

export function ThemeCode({
  code,
  lang = "text",
}: {
  code: string;
  lang?: string;
}) {
  const context = useModeContent();
  const themeId = context.themeId;

  if (!themeId) {
    return <DynamicCodeBlock lang={lang} code={code.trimEnd()} />;
  }

  const encodedThemeId = encodeURIComponent(themeId.trim());

  const processedCode = code.replace(/YOUR_THEME_ID/g, encodedThemeId);

  return <DynamicCodeBlock lang={lang} code={processedCode.trimEnd()} />;
}

export function ThemeConfigCard() {
  const [mode, setMode] = useLocalStorage<Mode>("theme-mode", "stylus");
  const [themeId, setThemeId] = useSessionStorage<string>("theme-id", "");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });

  /* eslint-disable react-hooks/set-state-in-effect -- mounted state initialization */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useInterval(
    () => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    },
    themeId.trim() ? null : 2000,
  );

  const generatedUrl = useMemo(() => {
    if (themeId.trim()) {
      const url = new URL(
        `https://coolify-tweaks-api.techwithanirudh.com/release/latest/`,
      );
      url.searchParams.set("theme", themeId.trim());
      url.searchParams.set(
        "asset",
        mode === "dynamic" ? "main.css" : "main.user.css",
      );
      return url.toString();
    }
    return "";
  }, [themeId, mode]);

  return (
    <Card className="w-full p-4">
      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground text-sm font-medium">
            Mode
          </Label>
          {!mounted ? (
            <div className="flex">
              <Skeleton className="h-8 w-16 rounded-r-none" />
              <Skeleton className="h-8 w-18 rounded-l-none" />
            </div>
          ) : (
            <ButtonGroup>
              <Button
                onClick={() => setMode("stylus")}
                className={`transition-all ${
                  mode === "stylus"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
                size="sm"
              >
                Stylus
              </Button>
              <Button
                onClick={() => setMode("dynamic")}
                className={`transition-all ${
                  mode === "dynamic"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
                size="sm"
              >
                Dynamic
              </Button>
            </ButtonGroup>
          )}
        </div>

        {/* Theme ID input */}
        <div className="flex flex-1 flex-col gap-2">
          <Label
            htmlFor="theme-id"
            className="text-muted-foreground text-sm font-medium"
          >
            Theme ID
          </Label>
          <Input
            id="theme-id"
            type="text"
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className="font-mono"
          />
        </div>
      </div>

      {generatedUrl && (
        <div className="animate-in fade-in slide-in-from-top-2 flex flex-1 flex-col gap-2 duration-300">
          <Label className="text-muted-foreground text-sm font-medium">
            Generated URL
          </Label>
          <InputGroup>
            <InputGroupInput
              type="text"
              value={generatedUrl}
              readOnly
              className="cursor-pointer font-mono text-sm"
              onClick={(e) => {
                e.currentTarget.select();
                copyToClipboard(generatedUrl);
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Copy"
                title="Copy"
                size="icon-xs"
                onClick={() => {
                  copyToClipboard(generatedUrl);
                }}
                className="animate-in fade-in slide-in-from-right-2 duration-300"
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}
    </Card>
  );
}

export function ModeContentStylus({ children }: { children: ReactNode }) {
  const context = useModeContent();

  const mode = context.mode;
  const mounted = context.mounted;

  if (!mounted || mode !== "stylus") {
    return null;
  }

  return <>{children}</>;
}

export function ModeContentDynamic({ children }: { children: ReactNode }) {
  const context = useModeContent();

  const mode = context.mode;
  const mounted = context.mounted;

  if (!mounted || mode !== "dynamic") {
    return null;
  }

  return <>{children}</>;
}

export function ModeContent({ children }: { children: ReactNode }) {
  const [mode] = useLocalStorage<Mode>("theme-mode", "stylus");
  const [themeId] = useSessionStorage<string>("theme-id", "");
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- mounted state initialization */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <ModeContentContext.Provider value={{ mode, mounted, themeId }}>
      {children}
    </ModeContentContext.Provider>
  );
}
