import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tbh.com"),
  title: "tbh — Something Cool is Coming",
  description:
    "Join the waitlist for tbh, a modern women's clothing brand. Be the first to get exclusive offers when we launch.",
  keywords: [
    "tbh",
    "women's clothing",
    "fashion brand",
    "coming soon",
    "waitlist",
    "exclusive offers",
    "modern fashion",
  ],
  authors: [{ name: "tbh" }],
  creator: "tbh",
  publisher: "tbh",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "tbh — Something Cool is Coming",
    description:
      "Join the waitlist for tbh. Be the first to get exclusive offers when we launch.",
    type: "website",
    locale: "en_US",
    url: "https://tbh.com",
    siteName: "tbh",
    images: [
      {
        url: "/tbh.png",
        width: 1200,
        height: 630,
        alt: "tbh — Modern Women's Clothing Brand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "tbh — Something Cool is Coming",
    description:
      "Join the waitlist for tbh. Be the first to get exclusive offers when we launch.",
    images: ["/tbh.png"],
  },
  icons: {
    icon: "/tbh.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "tbh",
              url: "https://tbh.com",
              description:
                "A modern women's clothing brand. Join the waitlist for exclusive offers.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://tbh.com",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
