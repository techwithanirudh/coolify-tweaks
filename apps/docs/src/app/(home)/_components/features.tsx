import { Badge } from "@repo/ui/badge";
import InstallMethods from "./features/install-methods";
import { Grid2X2 } from "lucide-react";
import { BlurImage } from "@/components/blur-image";
import { ThemeShowcase } from "./features/theme-showcase";
import { GitHubShowcase } from "./features/github-showcase";
import { owner, repo, getRepoStarsAndForks } from "@/lib/github";

export async function Features() {
  const { stars } = await getRepoStarsAndForks(owner, repo);

  return (
    <section className="w-full flex flex-col justify-center items-center">
      <div className="self-stretch px-6 sm:px-8 md:px-12 lg:px-0 py-12 sm:py-16 md:py-20 lg:py-24 border-b border-border flex justify-center items-center">
        <div className="w-full flex flex-col justify-start items-center gap-3 sm:gap-4">
          <Badge
            variant="secondary"
            className="border-border h-fit shadow-xs border px-2 py-1 text-sm"
          >
            <Grid2X2 />
            <span>Features</span>
          </Badge>
          <div className="w-full text-center flex justify-center flex-col text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight tracking-tight">
            Polished spacing, typography, and colors
          </div>
          <div className="self-stretch text-center text-muted-foreground text-sm sm:text-base font-normal leading-6">
            Layer polished spacing, typography, and colorwork on top of Coolify's dashboard.
            <br />
            Keep the UI familiar while smoothing out rough edges.
          </div>
        </div>
      </div>

      <div className="self-stretch flex justify-center items-start">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-border">
          <div className="border-b border-r-0 md:border-r border-border p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                Better UI
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed">
                Improved spacing, typography, and colors make your Coolify dashboard feel polished and intentional.
              </p>
            </div>
            <div className="w-full aspect-video rounded-lg flex items-center justify-center overflow-hidden bg-card border border-border relative">
              <BlurImage
                src="/assets/screenshots/dashboard-grid_themed.png"
                alt="Coolify Tweaks Dashboard Screenshot"
                fill
                imageClassName="object-cover"
              />
            </div>
          </div>

          <div className="border-b border-border p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 overflow-hidden">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold leading-tight text-lg sm:text-xl">
                Custom themes
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed">
                Use built-in themes or bring your own. Fully customizable to match your preferences and brand.
              </p>
            </div>
            <div className="w-full aspect-video rounded-lg flex items-center justify-center overflow-visible relative">
              <ThemeShowcase className="w-full h-full" />
            </div>
          </div>

          <div className="border-r-0 md:border-r border-border p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 bg-transparent">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                Many install methods
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed">
                Install directly through Traefik or use Stylus. Works with any Coolify instance and fully customizable.
              </p>
            </div>
            <div className="w-full aspect-video rounded-lg flex overflow-hidden justify-center items-center bg-card border border-border">
              <InstallMethods width={400} height={250} className="w-full h-full" />
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                Fully open-source
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed">
                Built in the open with community contributions. View the code, suggest improvements, or fork your own version.
              </p>
            </div>
            <div className="w-full aspect-video rounded-lg flex overflow-hidden items-center justify-center relative bg-card border border-border">
              <GitHubShowcase owner={owner} repo={repo} stars={stars} />
            </div>
          </div>
        </div>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch bg-dashed"></div>
      </div>
    </section>
  );
}

