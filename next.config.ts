import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath: "/family-tree",
  assetPrefix: "/family-tree/",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
