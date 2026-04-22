"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    // The text starts with a subtle lavender colour
    // GSAP will sweep a bright highlight across the text itself
    const tl = gsap.timeline({
      onComplete: () => {
        setUnmount(true);
        onComplete();
      },
    });

    // Phase 1: Sweep a highlight gradient across the text (0s → 1.5s)
    // We animate background-position on the text element
    tl.fromTo(
      textRef.current,
      {
        backgroundPosition: "-200% center",
      },
      {
        backgroundPosition: "200% center",
        duration: 1.5,
        ease: "power2.inOut",
      },
      0
    );

    // Phase 2: Hold (1.5s → 2.2s)
    tl.to({}, { duration: 0.7 }, 1.5);

    // Phase 3: Fade out entire loader (2.2s → 3.0s)
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
      },
      2.2
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (unmount) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#C9B9D6" }}
    >
      {/* "tbh" text — the shimmer runs ON the text via background-clip */}
      <div
        ref={textRef}
        className="select-none"
        style={{
          fontFamily: '"Bastia Bold", Georgia, serif',
          fontSize: "clamp(80px, 15vw, 140px)",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-2px",
          // The text itself is the gradient — background-clip makes the text colour a moving gradient
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.55) 100%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "-200% center",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        tbh
      </div>
    </div>
  );
}
