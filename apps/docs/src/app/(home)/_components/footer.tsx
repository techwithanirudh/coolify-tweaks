export function Footer() {
  return (
    <div className="w-full pt-10 flex flex-col justify-start items-start">
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-stretch pr-0 pb-8 pt-0">
        <div className="h-auto p-4 md:p-8 flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex justify-start items-center gap-3">
            <div className="text-center text-xl font-semibold leading-4 font-sans">Coolify Tweaks</div>
          </div>
          <div className="text-muted-foreground text-sm font-medium leading-[18px] font-sans">
            Polished spacing, typography, and colors for Coolify
          </div>
        </div>

        <div className="self-stretch p-4 md:p-8 flex flex-col sm:flex-row flex-wrap justify-start sm:justify-between items-start gap-6 md:gap-8">
          <div className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]">
            <div className="self-stretch text-muted-foreground/70 text-sm font-medium leading-5 font-sans">
              Product
            </div>
            <div className="flex flex-col justify-end items-start gap-2">
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Features
              </div>
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Pricing
              </div>
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Integrations
              </div>
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Real-time Previews
              </div>
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Multi-Agent Coding
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]">
            <div className="text-muted-foreground/70 text-sm font-medium leading-5 font-sans">Company</div>
            <div className="flex flex-col justify-center items-start gap-2">
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                About us
              </div>
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Our team
              </div>
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Careers
              </div>
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Brand
              </div>
              <div className="text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Contact
              </div>
            </div>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]">
            <div className="text-muted-foreground/70 text-sm font-medium leading-5 font-sans">Resources</div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="self-stretch text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Terms of use
              </div>
              <div className="self-stretch text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                API Reference
              </div>
              <div className="self-stretch text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Documentation
              </div>
              <div className="self-stretch text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Community
              </div>
              <div className="self-stretch text-sm font-normal leading-5 font-sans cursor-pointer hover:opacity-80 transition-opacity">
                Support
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="self-stretch h-12 border-b border-border bg-dashed border-t"></div>
    </div>
  );
}

