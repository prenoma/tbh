"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set isDesktop only on client side to avoid hydration mismatch
    setIsDesktop(window.innerWidth >= 1024);
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {/* Watermark background pattern — desktop only */}
        {isDesktop && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            fontFamily: '"Bastia Bold", Georgia, serif',
            fontSize: "72px",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: "calc(100% - 100px)" }}>
            {/* "tbh" pattern — alternating rows */}
            {Array.from({ length: 36 }).map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              // Odd rows (1, 3, 5...) offset to the right
              const isOddRow = row % 2 === 1;
              const leftOffset = isOddRow ? 12.5 : 0;
              
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    fontFamily: '"Bastia Bold", Georgia, serif',
                    fontSize: "64px",
                    fontWeight: 700,
                    color: "rgba(255, 255, 255, 0.12)",
                    left: `${leftOffset + col * 25}%`,
                    top: `${row * 14}%`,
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
