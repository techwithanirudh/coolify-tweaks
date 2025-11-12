"use client";

import { useState, useEffect, useRef } from "react";
import { FeatureCard } from "./feature-card";

export function Hero() {
  const [activeCard, setActiveCard] = useState(0);
  const [progress, setProgress] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return;
      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3);
          }
          return 0;
        }
        return prev + 2; // 2% every 100ms = 5 seconds total
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return;
    setActiveCard(index);
    setProgress(0);
  };

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
      <div className="w-full flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4">
          <div className="w-full text-center flex justify-center flex-col text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-tight px-2 sm:px-4 md:px-0">
            Polished Coolify dashboard
          </div>
          <div className="w-full text-center flex justify-center flex-col text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed px-2 sm:px-4 md:px-0">
            Layer polished spacing, typography on top of Coolify.
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6">
        <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4">
          <a
            href="/docs"
            className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative bg-primary text-primary-foreground overflow-hidden rounded-full flex justify-center items-center hover:bg-primary/90 transition-colors"
          >
            <div className="flex flex-col justify-center text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans">
              Get Started
            </div>
          </a>
        </div>
      </div>
      <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
        <img
          src="/mask-group-pattern.svg"
          alt=""
          className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
          style={{
            filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
          }}
        />
      </div>
      <div className="w-full pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0">
        <div className="w-full aspect-video bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] flex flex-col justify-start items-start">
          {/* Dashboard Content */}
          <div className="self-stretch flex-1 flex justify-start items-start">
            {/* Main Content */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden">
                {/* Product Image 1 - Plan your schedules */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeCard === 0 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                  }`}
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dsadsadsa.jpg-xTHS4hGwCWp2H5bTj8np6DXZUyrxX7.jpeg"
                    alt="Schedules Dashboard - Customer Subscription Management"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Product Image 2 - Data to insights */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeCard === 1 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                  }`}
                >
                  <img
                    src="/analytics-dashboard-with-charts-graphs-and-data-vi.jpg"
                    alt="Analytics Dashboard"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Product Image 3 - Data visualization */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeCard === 2 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                  }`}
                >
                  <img
                    src="/data-visualization-dashboard-with-interactive-char.jpg"
                    alt="Data Visualization Dashboard"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>
        <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
          {/* Feature Cards */}
          <FeatureCard
            title="Better spacing"
            description="Improved padding and margins make the dashboard feel less cramped and more intentional."
            isActive={activeCard === 0}
            progress={activeCard === 0 ? progress : 0}
            onClick={() => handleCardClick(0)}
          />
          <FeatureCard
            title="Refined typography"
            description="Enhanced font weights, sizes, and line heights improve readability across all pages."
            isActive={activeCard === 1}
            progress={activeCard === 1 ? progress : 0}
            onClick={() => handleCardClick(1)}
          />
          <FeatureCard
            title="Subtle theming"
            description="Polished colorwork and shadows lift the entire control plane without changing functionality."
            isActive={activeCard === 2}
            progress={activeCard === 2 ? progress : 0}
            onClick={() => handleCardClick(2)}
          />
        </div>
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>
      </div>
    </div>
  );
}

