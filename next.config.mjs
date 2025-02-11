/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.apple.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
