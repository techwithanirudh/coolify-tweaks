"use client";

import type { HTMLAttributes } from "react";
import { useLayoutEffect, useState } from "react";
import { Airplay, Moon, Sun } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { useTheme } from "next-themes";

import { cn } from "@repo/ui";

const themes = [
  { key: "light", icon: Sun, label: "Light theme" },
  { key: "dark", icon: Moon, label: "Dark theme" },
  { key: "system", icon: Airplay, label: "System theme" },
];

export function ThemeToggle({
  className,
  mode = "light-dark",
  ...props
}: HTMLAttributes<HTMLElement> & {
  mode?: "light-dark" | "light-dark-system";
}) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- mounted state initialization */
  useLayoutEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const container = cn(
    "ring-border relative isolate inline-flex items-center overflow-hidden rounded-full p-1 ring-1",
    className,
  );

  if (mode === "light-dark") {
    const value = mounted ? resolvedTheme : null;

    return (
      <LayoutGroup>
        <button
          className={container}
          aria-label="Toggle Theme"
          onClick={() => setTheme(value === "light" ? "dark" : "light")}
          data-theme-toggle=""
          {...props}
        >
          {themes.map(({ key, icon: Icon }) => {
            if (key === "system") return null;
            const isActive = value === key;
            return (
              <div key={key} className="relative size-6.5 rounded-full p-1.5">
                {isActive && <Pill />}
                <Icon
                  className={cn(
                    "relative z-10 m-auto size-full",
                    isActive
                      ? "text-muted-foreground"
                      : "text-accent-foreground",
                  )}
                  fill="currentColor"
                />
              </div>
            );
          })}
        </button>
      </LayoutGroup>
    );
  }

  const value = mounted ? theme : null;

  return (
    <LayoutGroup>
      <div className={container} data-theme-toggle="" {...props}>
        {themes.map(({ key, icon: Icon }) => {
          const isActive = value === key;
          return (
            <button
              type="button"
              key={key}
              aria-label={key}
              className="relative size-6.5 rounded-full p-1.5"
              onClick={() => setTheme(key)}
            >
              {isActive && <Pill />}
              <Icon
                className={cn(
                  "relative z-10 m-auto size-full",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
                fill="currentColor"
              />
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

const Pill = () => (
  <motion.div
    layoutId="activeTheme"
    initial={false}
    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
    className="bg-accent pointer-events-none absolute inset-0 z-0 rounded-full"
  />
);
