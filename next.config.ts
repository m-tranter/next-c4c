import type { NextConfig } from "next";
import path from "path";

const __dirname = import.meta.dirname;

const blockVersionId = process.env.BLOCK_VERSION_ID;

const nextConfig: NextConfig = {
  output: "standalone",

  webpack(config, { isServer }) {
    if (!isServer) config.output.publicPath = "auto";
    return config;
  },

  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/:slug*/elections-dashboard/:election/:path*",
          destination: "/elections-dashboard/:election/:path*?slug=:slug*",
        },
      ],
      fallback: [],
    };
  },

  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
