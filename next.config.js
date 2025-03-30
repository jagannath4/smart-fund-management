/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This enables static export
  basePath: '/smart-fund-management', // Change this to your repo name
  trailingSlash: true,
};

module.exports = nextConfig;
