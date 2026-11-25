import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The development-only PGlite lab uses native Node/WASM package loading.
  serverExternalPackages: ["@electric-sql/pglite"],
  async redirects() {
    return [
      {
        source: "/autism",
        destination: "/autism-test",
        permanent: true,
      },
      {
        source: "/audhdtest",
        destination: "/audhd-test",
        permanent: true,
      },
      {
        source: "/adhd",
        destination: "/adhd-test",
        permanent: true,
      },
      {
        source: "/adhdtest",
        destination: "/adhd-test",
        permanent: true,
      },
      {
        source: "/autismtest",
        destination: "/autism-test",
        permanent: true,
      },
      {
        source: "/autsim-test",
        destination: "/autism-test",
        permanent: true,
      },
      {
        source: "/audhd-bok/tack/klar",
        destination: "/audhd-bok/tack",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/no/hjernen-i-kryssild/leseprove.pdf",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/no/audhd-test/test",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
      {
        source: "/no/hjernen-i-kryssild/takk",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/seo-images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/mina-sidor/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
