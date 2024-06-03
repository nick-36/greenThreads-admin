/** @type {import('next').NextConfig} */
// @ts-ignore
const isDev = process.env.NODE_ENV !== "production";

const getRedirects = () => {
  return [
    {
      source: "/",
      destination: "/admin/analytics",
      permanent: true,
    },
    {
      source: "/admin",
      destination: "/admin/analytics",
      permanent: true,
    },
  ];
};
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
  async redirects() {
    return [...getRedirects()];
  },
};

if (isDev) {
  nextConfig.rewrites = async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_API_URL}/:path*`, // Proxy to Backend
      },
    ];
  };
}

export default nextConfig;
