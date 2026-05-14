import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    dirs: ['app', 'components', 'registry', 'lib', 'hooks']
  }
};

export default nextConfig;
