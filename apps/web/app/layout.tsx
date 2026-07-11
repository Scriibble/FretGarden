import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  applicationName: "FretGarden",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "FretGarden | Grow Your Fretboard Knowledge",
    template: "%s | FretGarden"
  },
  description:
    "Learn guitar notes, chord tones, scale degrees, intervals, and musical structure through focused practice designed to grow with you.",
  keywords: [
    "guitar fretboard practice",
    "fretboard trainer",
    "music theory for guitar",
    "note recognition",
    "chord tones",
    "scale degrees",
    "guitar intervals"
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/brand/fretgarden-icon.svg"
  },
  openGraph: {
    title: "FretGarden | Grow Your Fretboard Knowledge",
    description:
      "Build practical fretboard knowledge through focused guitar exercises for notes, chord tones, scale degrees, intervals, and musical relationships.",
    siteName: "FretGarden",
    type: "website",
    images: [
      {
        url: "/brand/fretgarden-logo.svg",
        width: 960,
        height: 260,
        alt: "FretGarden logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FretGarden | Grow Your Fretboard Knowledge",
    description:
      "Focused guitar practice for notes, chord tones, scale degrees, intervals, and musical structure.",
    images: ["/brand/fretgarden-logo.svg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
