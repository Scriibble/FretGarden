import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: [
    "@pocket-practice/education-content",
    "@pocket-practice/education-engine",
    "@pocket-practice/fretboard-engine",
    "@pocket-practice/music-theory-engine"
  ]
};

export default nextConfig;
