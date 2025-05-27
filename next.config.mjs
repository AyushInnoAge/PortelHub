/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // add this line

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
    ],
  },
};

export default nextConfig;
