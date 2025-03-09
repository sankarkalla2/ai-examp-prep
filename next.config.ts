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
    ],
  },
};

export default nextConfig;
