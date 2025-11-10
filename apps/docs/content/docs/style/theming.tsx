"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

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

const placeholders = [
  "claude",
  "c12345678",
  "theme-001",
  "gpt-theme",
  "t_abc123",
];

type Mode = "dynamic" | "stylus";

export function ThemeConfigCard() {
  const [mode, setMode] = useState<Mode>("dynamic");
  const [themeId, setThemeId] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });

  useEffect(() => {
    if (themeId.trim()) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [themeId]);

  const generatedUrl = useMemo(() => {
    if (themeId.trim()) {
      const baseUrl = `https://coolify.io/tweaks/${mode === "dynamic" ? "main.css" : "main.user.css"}`;
      return `${baseUrl}?theme=${themeId.trim()}`;
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
          <ButtonGroup>
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
          </ButtonGroup>
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
              className="font-mono text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Copy"
                title="Copy"
                size="icon-xs"
                onClick={() => {
                  copyToClipboard(generatedUrl);
                }}
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
