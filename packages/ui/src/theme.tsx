"use client";

import type * as React from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="[&>svg]:absolute [&>svg]:size-5 [&>svg]:scale-0"
        >
          <SunIcon className="light:scale-100! auto:scale-0!" />
          <MoonIcon className="auto:scale-0! dark:scale-100!" />
          <MonitorIcon className="auto:scale-100!" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("auto")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { useTheme } from "next-themes";
