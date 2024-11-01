/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "*.marscode.dev",
        },
      ],
    }];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com"
      },
    ],
  },
};

export default nextConfig;