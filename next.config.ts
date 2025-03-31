import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "<APP_ID>.ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/shadcn.png",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["pdfjs-dist"] = "pdfjs-dist/build/pdf";
    return config;
  },
};

export default nextConfig;
