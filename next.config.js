const path = require("path");

const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  reactStrictMode: false,
  env: {
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://my-crocs-next.vercel.app',
  },
  webpack(config, { dev }) {
    // Add path alias to resolve the @ symbol
    config.resolve.alias["@"] = path.join(__dirname, "src");

    if (dev) {
      config.devtool = "source-map"; // Ensure source maps are enabled
    }
    return config;
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
