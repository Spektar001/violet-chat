import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "tacit-warbler-460.convex.cloud" }],
  },
};

export default nextConfig;
