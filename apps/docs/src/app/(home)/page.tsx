"use client";

import type { ReactElement } from "react";
import { Hero } from "./_components/hero";
import { BentoGridSection } from "./_components/bento-grid-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTASection } from "./_components/cta-section";
import { FooterSection } from "./_components/footer-section";

export default function LandingPage(): ReactElement {
  return (
    <div className="w-full flex flex-col justify-start items-center container border px-0">
      {/* Hero Section */}
      <Hero />

      {/* Bento Grid Section */}
      <BentoGridSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
