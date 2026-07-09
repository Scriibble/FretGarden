import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  applicationName: "FretGarden",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "FretGarden",
    template: "%s | FretGarden"
  },
  description:
    "Guitar fretboard practice for notes, chord tones, and scale degrees.",
  keywords: [
    "guitar fretboard practice",
    "fretboard trainer",
    "note recognition",
    "chord tones",
    "scale degrees"
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/brand/fretgarden-icon.svg"
  },
  openGraph: {
    title: "FretGarden",
    description:
      "Grow your fretboard fluency with short guitar drills for notes, chord tones, and scale degrees.",
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
    title: "FretGarden",
    description:
      "Guitar fretboard practice for notes, chord tones, and scale degrees.",
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
