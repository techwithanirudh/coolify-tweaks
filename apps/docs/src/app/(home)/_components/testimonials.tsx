"use client";

export function Testimonials() {
  const testimonials = [
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

  return (
    <section className="py-8">
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="py-12 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-4xl md:text-5xl font-normal leading-tight text-center">
              Loved by the community
            </h2>
            <p className="text-muted-foreground text-lg font-medium leading-7 text-center">
              See what people are saying about Coolify Tweaks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card border border-border p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">{testimonial.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{testimonial.handle}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                  </svg>
                </div>

                {/* Content */}
                <p className="text-muted-foreground text-sm leading-[22px]">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

