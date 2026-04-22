"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [watermarkFontSize, setWatermarkFontSize] = useState("64px");
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && mainRef.current) {
      const children = mainRef.current.querySelectorAll(".reveal-item");
      gsap.fromTo(
        children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }
  }, [loading]);

  // Handle responsive watermark sizing — use viewport width units
  useEffect(() => {
    // Use vw (viewport width) so it scales proportionally across all screen sizes
    // 10vw is larger, more visible across mobile, tablet, and desktop
    setWatermarkFontSize("10vw");
  }, []);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <div
        ref={mainRef}
        className="h-screen overflow-hidden flex flex-col relative"
        style={{
          opacity: loading ? 0 : 1,
          backgroundColor: "#C9B9D6",
        }}
      >
        {/* Watermark background pattern — FIXED so it stays static, desktop only */}
        {typeof window !== "undefined" && window.innerWidth >= 1024 && (
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{
            fontFamily: '"Bastia Bold", Georgia, serif',
            display: "flex",
            justifyContent: "center",
            zIndex: 0,
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: "calc(100% - 100px)" }}>
            {/* "tbh" pattern — alternating rows, desktop only */}
            {Array.from({ length: 36 }).map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              // Odd rows (1, 3, 5...) offset to the right
              const isOddRow = row % 2 === 1;
              const leftOffset = isOddRow ? 12.5 : 0;
              
              const rowSpacing = 14;
              
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    fontFamily: '"Bastia Bold", Georgia, serif',
                    fontSize: watermarkFontSize,
                    fontWeight: 700,
                    color: "rgba(255, 255, 255, 0.12)",
                    left: `${leftOffset + col * 25}%`,
                    top: `${row * rowSpacing}%`,
                    whiteSpace: "nowrap",
                  }}
                >
                  tbh
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Main content — vertical stack */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-6 relative z-10">
          <Hero />
          <div className="w-full max-w-md my-3" style={{ borderBottom: "1px solid rgba(75, 56, 143, 0.2)" }} />
          <WaitlistForm />
        </div>

        <div className="w-full px-6 relative z-10" style={{ borderTop: "1px solid rgba(75, 56, 143, 0.2)" }} />
        <Footer />
      </div>
    </>
  );
}
