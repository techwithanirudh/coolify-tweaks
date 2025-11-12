import type { ReactElement } from "react";
import { Hero } from "./_components/hero";
import { BentoGridSection } from "./_components/bento-grid-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTASection } from "./_components/cta-section";
import { FooterSection } from "./_components/footer-section";

export default function LandingPage(): ReactElement {
  return (
    <main className='flex flex-1 flex-col divide-y divide-border container border-x px-0'>
      <Hero />
      <BentoGridSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
