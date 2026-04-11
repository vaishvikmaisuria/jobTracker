/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@job-tracker/types", "@job-tracker/storage", "@job-tracker/core"],
  experimental: {
    // Use App Router exclusively
  },
};

module.exports = nextConfig;
