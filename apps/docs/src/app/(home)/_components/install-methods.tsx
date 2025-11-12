import type React from "react";

interface ManyInstallMethodsProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Many Install Methods Component
 * Displays browser extension and server injection options
 */
const ManyInstallMethods: React.FC<ManyInstallMethodsProps> = ({
  width = 400,
  height = 250,
  className = "",
}) => {
  return (
    <div
      className={`${className} flex items-center justify-center`}
      style={{
        width,
        height,
        position: "relative",
      }}
    >
      <div className="w-full h-full flex flex-col gap-2 p-3">
        {/* Browser Extension Card */}
        <div className="flex-1 bg-background rounded-lg shadow-xs p-3 flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-200">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-primary rounded-md flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary-foreground"
                >
                  <path
                    d="M9 3L11 7L15 7.5L12 10.5L12.5 15L9 12.5L5.5 15L6 10.5L3 7.5L7 7L9 3Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4 className="text-foreground font-semibold text-sm">Browser Extension</h4>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">Quick setup</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-medium text-accent-foreground">Chrome</span>
            <span className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-medium text-accent-foreground">Firefox</span>
            <span className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-medium text-accent-foreground">Edge</span>
            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-medium">
              ✨ Install with one click
            </span>
          </div>
        </div>

        {/* Server Injection Card */}
        <div className="flex-1 bg-background rounded-lg shadow-xs p-3 flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-200">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-primary rounded-md flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary-foreground"
                >
                  <rect x="3" y="4" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path
                    d="M6 7L8 9L6 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="10" y1="11" x2="12" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="text-foreground font-semibold text-sm">Server Injection</h4>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">Works everywhere</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-medium text-accent-foreground">
              🌐 All browsers & devices
            </span>
            <span className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-medium text-accent-foreground">
              👥 Perfect for teams
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManyInstallMethods;
