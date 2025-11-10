import type { LucideIcon } from "lucide-react";
import type { LinkProps } from "next/link";
import type { ReactElement, ReactNode } from "react";
import Link from "next/link";
import { PaletteIcon, WebhookIcon } from "lucide-react";

import { cn } from "@repo/ui";

export default function DocsPage(): ReactElement {
  return (
    <main className="container flex max-w-[1300px] flex-col py-16">
      <h1 className="text-2xl font-semibold md:text-3xl">
        Welcome to Coolify Tweaks
      </h1>
      <p className="text-fd-muted-foreground mt-1 text-lg">
        Get started with Fumadocs.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
        <DocumentationItem
          title="Style"
          description="Get started with the Style framework."
          icon={{ icon: PaletteIcon, id: "style" }}
          href="/docs/style"
        />

        <DocumentationItem
          title="API"
          description="Get started with Coolify Tweaks's API."
          icon={{ icon: WebhookIcon, id: "api" }}
          href="/docs/api"
        />
      </div>
    </main>
  );
}

function DocumentationItem({
  title,
  description,
  icon: { icon: ItemIcon, id },
  href,
}: {
  title: string;
  description: string;
  icon: {
    icon: LucideIcon;
    id: string;
  };
  href: string;
}): ReactElement {
  return (
    <Item href={href}>
      <Icon className={id}>
        <ItemIcon className="size-full" />
      </Icon>
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="text-fd-muted-foreground text-sm">{description}</p>
    </Item>
  );
}

function Icon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}): ReactElement {
  return (
    <div
      className={cn(
        "shadow-fd-primary/30 mb-2 size-9 rounded-lg border p-1.5",
        className,
      )}
      style={{
        boxShadow: "inset 0px 8px 8px 0px var(--tw-shadow-color)",
      }}
    >
      {children}
    </div>
  );
}

function Item(
  props: LinkProps & { className?: string; children: ReactNode },
): ReactElement {
  const { className, children, ...rest } = props;
  return (
    <Link
      {...rest}
      className={cn(
        "border-border bg-fd-accent/30 hover:bg-fd-accent rounded-2xl border p-6 shadow-lg backdrop-blur-lg transition-all",
        className,
      )}
    >
      {children}
    </Link>
  );
}
