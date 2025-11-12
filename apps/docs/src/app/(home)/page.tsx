import type { ReactElement } from "react";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { Testimonials } from "./_components/testimonials";
import { CTA } from "./_components/cta";
import { Footer } from "./_components/footer";

export default function LandingPage(): ReactElement {
  return (
    <main className='flex flex-1 flex-col divide-y divide-border container border-x px-0'>
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
