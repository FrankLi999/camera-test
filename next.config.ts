import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ['192.168.40.225'],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          // other headers omitted for brevity...
          { key: "Cross-Origin-Opener-Policy", value: "*" }
        ]
      }
    ]
  }
  /* config options here */
};


export default nextConfig;
