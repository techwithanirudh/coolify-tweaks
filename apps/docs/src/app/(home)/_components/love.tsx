'use client'

import { HeartIcon } from "lucide-react";
import confetti from "canvas-confetti";

export function Love() {
    const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2;

        const heart = confetti.shapeFromText({ text: "❤️", scalar: 1.2 });

        const defaults = {
            spread: 180,
            ticks: 50,
            gravity: 0.5,
            decay: 0.92,
            startVelocity: 25,
            drift: 0,
            colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
            origin: {
                x: x / window.innerWidth,
                y: y / window.innerHeight,
            },
        }
        const shoot = () => {
            void confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: [heart],
            })
            void confetti({
                ...defaults,
                particleCount: 10,
                scalar: 0.75,
                shapes: ["circle"],
            })
        }

        setTimeout(shoot, 0)
        setTimeout(shoot, 100)
        setTimeout(shoot, 200)
    }

    return (
        <HeartIcon className="size-4 fill-primary/80 text-primary hover:scale-120 hover:fill-primary hover:-rotate-12 transition-all duration-300" onClick={handleClick} />
    );
}

