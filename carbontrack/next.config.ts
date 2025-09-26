import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   turbopack: {
            root: '/home/student/carbontrack-frontend/carbontrack', 
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
