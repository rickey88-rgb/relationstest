import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/audhdtest",
        destination: "/audhd-test",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/seo-images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
