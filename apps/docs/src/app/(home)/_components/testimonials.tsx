// cspell:disable
import { MessageCircle } from "lucide-react";

import { Badge } from "@repo/ui/badge";
import { Card } from "@repo/ui/card";

import { BlurImage } from "@/components/blur-image";

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  content: string;
  link: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aditya Tripathi",
    handle: "@AdityaTripathiD",
    avatar:
      "https://pbs.twimg.com/profile_images/1846547196285505536/518NaEuI_400x400.jpg",
    link: "https://x.com/AdityaTripathiD/status/1949205413897101786",
    content:
      "Colliding worlds with Coolify looking like Vercel 😂. Shout out to Anirudh for making this theming tool which works with TweakCN!",
  },
  {
    name: "🏔️ Peak",
    handle: "@peaklabs_dev",
    avatar:
      "https://pbs.twimg.com/profile_images/1839743450490531840/HUFCe3IH_400x400.jpg",
    link: "https://discord.com/channels/459365938081431553/1401119937279299796/1401302578477666496",
    content: "Really cool stuff! ",
  },
  {
    name: "Devarsh",
    handle: "@webdev03",
    avatar: "https://github.com/webdev03.png",
    // link: "https://discord.com/channels/@me/1164801461352411167/1393567808603816028",
    link: "https://devarsh.me/",
    content: "coolify looks amazing with your tweaks",
  },
  {
    name: "JustSerdar",
    handle: "@JustSerdarDev",
    avatar:
      "https://pbs.twimg.com/profile_images/1950271763356540928/4iQpXbJB_400x400.jpg",
    link: "https://discord.com/channels/459365938081431553/1009177753230245928/1399740065764085895",
    content: "Honestly this is (a) pretty cool theme! It looks like cool tech",
  },
  {
    name: "Noah Dunnagen",
    handle: "@itsnoahd",
    avatar:
      "https://pbs.twimg.com/profile_images/1934393746973511680/tR0dyR1A_400x400.jpg",
    link: "https://x.com/itsnoahd/status/1949226795691327954",
    content: "Ohhhh sick! He(Anirudh)'s goated with user styles!",
  },
  {
    name: "Ben",
    handle: "@0x5b62656e5d",
    avatar:
      "https://pbs.twimg.com/profile_images/1967914627364425731/_A-tjVMq_400x400.jpg",
    link: "https://discord.com/channels/1369422992676880424/1369422992676880427/1431141172797112422",
    content: "yooo damn",
  },
];

export function Testimonials() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-8 py-12">
          <div className="flex flex-col items-center gap-3">
            <Badge
              variant="secondary"
              className="border-border group/badge h-fit border px-2 py-1 text-sm shadow-xs"
            >
              <MessageCircle className="transition-transform duration-200 group-hover/badge:scale-110 group-hover/badge:-rotate-12" />
              <span>Testimonials</span>
            </Badge>
            <div className="flex w-full flex-col justify-center text-center text-xl leading-tight font-semibold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl">
              Loved by the community
            </div>
            <div className="text-muted-foreground self-stretch text-center text-sm leading-6 font-normal sm:text-base sm:leading-7">
              See what people are saying about Coolify Tweaks.
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card
                key={index}
                className="px-0 py-0 transition-transform duration-200 hover:scale-[1.02]"
              >
                <a
                  href={testimonial.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-full space-y-4 p-6"
                >
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
                          <span className="text-sm font-semibold">
                            {testimonial.name}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {testimonial.handle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {testimonial.content}
                  </p>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
