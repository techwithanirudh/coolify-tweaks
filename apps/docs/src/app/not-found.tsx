import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1">
      <div className="flex flex-auto flex-col items-center justify-center px-4 text-center sm:flex-row">
        <h1 className="border-border text-foreground text-2xl font-extrabold tracking-tight sm:mr-6 sm:border-r sm:pr-6 sm:text-3xl">
          404
        </h1>
        <h2 className="text-muted-foreground mt-2 sm:mt-0">
          This page could not be found.{" "}
          <Link
            href="/"
            className="text-primary hover:text-primary/80 underline underline-offset-4"
          >
            Go back home
          </Link>
        </h2>
      </div>
    </main>
  );
}
