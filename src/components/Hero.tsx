export default function Hero() {
  return (
    <div className="reveal-item flex flex-col items-center text-center max-w-2xl py-1">
      {/* Headline */}
      <h1
        className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl mb-2"
        style={{
          fontFamily: '"Bastia Bold", Georgia, serif',
          fontWeight: 700,
          letterSpacing: "-1px",
          lineHeight: "0.95",
        }}
      >
        <span style={{ color: "#EF5D34" }}>something cool</span>
        <br />
        <span style={{ color: "#4B388F" }}>is coming...</span>
      </h1>

      {/* Subtitle */}
      <p
        className="text-xs sm:text-sm leading-relaxed max-w-md"
        style={{
          color: "#4B388F",
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 600,
          opacity: 0.8,
        }}
      >
        drop your info and we&apos;ll get in touch with exclusive offers
        when we launch our site.
      </p>
    </div>
  );
}
