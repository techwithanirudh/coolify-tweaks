import { BlurImage } from "@/components/blur-image";
import { Badge } from "@repo/ui/badge";
import { MessageCircle } from "lucide-react";
import { Card } from "@repo/ui/card";

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  content: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Chen",
    handle: "@sarahchen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content:
      "Coolify Tweaks has completely transformed how we interact with our Coolify dashboard. The improved spacing and typography make everything so much more readable and professional.",
  },
  {
    name: "Marcus Rodriguez",
    handle: "@marcusdev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    content:
      "Been using Coolify Tweaks for the past 3 months and I'm blown away. The polished UI saves us hours every week and makes the dashboard feel intentional.",
  },
  {
    name: "Jamie Lee",
    handle: "@jamielee_",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
    content:
      "If you're not using Coolify Tweaks yet, you're missing out. It's a game-changer for making your Coolify dashboard feel polished without any complexity.",
  },
  {
    name: "Alex Thompson",
    handle: "@alexthompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    content:
      "The subtle theming in Coolify Tweaks is incredible. Our dashboard feels more intentional and the improved spacing makes everything easier to scan.",
  },
  {
    name: "Priya Patel",
    handle: "@priyapatdev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    content:
      "I've tried many dashboard themes, but Coolify Tweaks stands out. The attention to detail and how it keeps the UI familiar while smoothing rough edges is top-notch.",
  },
  {
    name: "David Kim",
    handle: "@davidkim_tech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    content:
      "Coolify Tweaks has become an essential part of our setup. The easy installation and polished spacing are exactly what we needed for our Coolify instance.",
  },
];

export function Testimonials() {
  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-12 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <Badge
              variant="secondary"
              className="border-border h-fit shadow-xs border px-2 py-1 text-sm group/badge"
            >
              <MessageCircle className="group-hover/badge:scale-110 group-hover/badge:-rotate-12 transition-transform duration-200" />
              <span>Testimonials</span>
            </Badge>
            <div className="w-full text-center flex justify-center flex-col text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight tracking-tight">
              Loved by the community
            </div>
            <div className="self-stretch text-center text-muted-foreground text-sm sm:text-base font-normal leading-6 sm:leading-7">
              See what people are saying about Coolify Tweaks.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="gap-4 p-6 hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <BlurImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="rounded-full"
                      width={48}
                      height={48}
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">{testimonial.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{testimonial.handle}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{testimonial.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

