import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  serverExternalPackages: ["@react-pdf/renderer"],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config
  }
};

export default nextConfig;
