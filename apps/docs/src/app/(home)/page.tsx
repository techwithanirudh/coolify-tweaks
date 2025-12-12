import type { ReactElement } from "react";

import { CTA } from "./_components/cta";
import { Features } from "./_components/features";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { Testimonials } from "./_components/testimonials";

export default function LandingPage(): ReactElement {
  return (
    <main className="divide-border mx-auto w-full max-w-[1400px] flex flex-1 flex-col divide-y border-x px-0">
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
