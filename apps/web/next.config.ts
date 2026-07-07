import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pocket-practice/fretboard-engine",
    "@pocket-practice/music-theory-engine"
  ]
};

export default nextConfig;
