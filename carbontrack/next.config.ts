import type { NextConfig } from "next";
import path from "path";


const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'carbon-track-680e7cff8d27.herokuapp.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
