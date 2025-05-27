/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  basePath: "/PortalHub", // replace with your GitHub repo name

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
